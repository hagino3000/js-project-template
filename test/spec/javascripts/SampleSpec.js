
describe('Friend Chat', function() {


  describe('AppServerにチャットリクエストを送信する', function() {

    var response, errorResponse;

    var callbacks = {
      onFailure: function(data) { errorResponse = data; },
      onSuccess: function(data) { response = data; }
    };

    function responseChecker() {
      return response || errorResponse;
    }

    beforeEach(function() {
      response = null;
      errorResponse = null;
    });

    it('不明なユーザーからのリクエストには403エラーが返る', function() {
      ubitalk.RPC.request({
        method: 'chat_request',
        params: {
          user_id: 'unknown_user_from_unit_test',
          nickname: 'unknown user',
          chat_with: testUsers[1].contactId
        },
        success: callbacks.onSuccess,
        failure: callbacks.onFailure
      });

      waitsFor(responseChecker, 5000, 'Server Response');

      runs(function() {
        expect(errorResponse).toBeNull();
        result = JSON.parse(response.responseText);
        expect(result.error).not.toBeNull();
        expect(result.error.code).toEqual(403);
      });

    });

    it('呼び出し先ユーザーが存在しない場合は404エラーが返る', function() {

      ubitalk.RPC.request({
        method: 'chat_request',
        params: {
          user_id: testUsers[0].userId,
          nickname: testUsers[0].nickname,
          chat_with: 'unknown_user_from_unit_test'
        },
        success: callbacks.onSuccess,
        failure: callbacks.onFailure
      });

      waitsFor(responseChecker, 5000, 'Server Response');

      runs(function() {
        expect(errorResponse).toBeNull();
        result = JSON.parse(response.responseText);
        expect(result.error).toBeDefined();
        expect(result.error.code).toEqual(404);
      });
    });

    describe('正常系', function() {

      it('Success Callbackにてレスポンスが得られる', function() {
        ubitalk.RPC.request({
          method: 'chat_request',
          params: {
            user_id: testUsers[0].userId,
            chat_with: testUsers[1].contactId,
            nickname: testUsers[0].nickname
          },
          success: callbacks.onSuccess,
          failure: callbacks.onFailure
        });

        waitsFor(responseChecker, 5000, 'サーバーレスポンスを待つ');

        runs(function() {
          expect(errorResponse).toBeNull();
          expect(response).not.toBeNull();
          serverResponses[0] = response;
        });
      });

      describe('レスポンスにチャットサーバーの情報が含まれている', function() {
        var response;

        beforeEach(function() {
          response = JSON.parse(serverResponses[0].responseText);
        });

        it('エラー情報が無い', function() {
          expect(response.error).toBeNull();
        });

        it('チャットサーバーのURL', function() {
          expect(response.result.live_server).toBeDefined();
        });

        it('チャットルームID', function() {
          expect(response.result.chatroom_id).toBeDefined();
        });
      });

    });
  });


  describe('チャットサーバー接続前の準備', function() {

    var chatServerUrl;

    beforeEach(function() {
      var response = JSON.parse(serverResponses[0].responseText);
      chatServerUrl = response.result.live_server;
      WEB_SOCKET_SWF_LOCATION = chatServerUrl + '/socket.io/static/flashsocket/WebSocketMainInsecure.swf';
    });

    it('チャットサーバーからsocket.io.jsを取得できる', function() {
      var loaded = false, failed = false;
      ubitalk.RPC.loadSocketIO(chatServerUrl, function() {
        loaded = true;
      }, function() {
        failed = true;
      });

      waitsFor(function() {
        return loaded || failed;
      }, 5000, 'Socket.io.js loaded');

      runs(function() {
        expect(loaded).toBe(true);
        expect(failed).toBe(false);
      });
    });
  });

  var socket1;

  describe('呼び出し元のユーザーはチャットReady状態になる', function() {
    var chatServerUrl, chatRoomId, 
        connected = true,
        ready = false, 
        gotError = false, 
        disconnected = false;

    beforeEach(function() {
      var response = JSON.parse(serverResponses[0].responseText);
      chatServerUrl = response.result.live_server;
      chatRoomId = response.result.chatroom_id;
    });

    it('チャットサーバーに接続できる', function() {
      socket1 = io.connect(chatServerUrl, socketOption);
      socket1.on('connect', function(data) {
        connected = true;
      });
      socket1.on('error', function() {
        gotError = true;
      });
      socket1.on('disconnect', function() {
        disconnected = true
      });

      waitsFor(function() {
        return connected || gotError || disconnected;
      }, 5000, 'チャットサーバーに接続');

      runs(function() {
        expect(connected).toBe(true);
        expect(disconnected).toBe(false);
        expect(gotError).toBe(false);
      });
    });

    it('相手の接続を待つ状態になる', function() {
      socket1.on('chat_ready', function() {
        ready = true;
      });

      socket1.emit('request_chat', {
        contactId: testUsers[0].contactId,
        chatRoomId: chatRoomId
      });

      waitsFor(function() {
        return ready || gotError || disconnected;
      }, 5000, 'チャット待ち状態になる');

      runs(function() {
        expect(connected).toBe(true);
        expect(ready).toBe(true);
        expect(disconnected).toBe(false);
        expect(gotError).toBe(false);
      });
    });

  });

  var socket2;

  describe('呼び出し先のユーザーがチャットサーバーに接続できる', function() {

    var chatServerUrl, callerContactId, chatRoomId;
    var connected = false, disconnected = false, started = false, gotError = false;

    describe('チャットコール通知が届く', function() {

      var response = null, errorResponse = null, result;

      var callbacks = {
        onFailure: function(data) { errorResponse = data; },
        onSuccess: function(data) { response = data; }
      };

      it('通知を受ける事ができる', function() {
        ubitalk.RPC.request({
          method: 'status',
          params: {
            user_id: testUsers[1].userId
          },
          success: callbacks.onSuccess,
          failure: callbacks.onFailure
        });

        waitsFor(function() {
          return response || errorResponse;
        }, 5000, '通知を取得する');

        runs(function() {
          expect(response).not.toBeNull();
          expect(errorResponse).toBeNull();
          result = JSON.parse(response.responseText).result;
        });
      });

      it('相手の名前が含まれる', function() {
        expect(result.chat_request.host_nickname).toBe(testUsers[0].nickname);
      });

      it('相手のコンタクトIDが含まれる', function() {
        callerContactId = result.chat_request.host_contact_id;
        expect(callerContactId).toBe(testUsers[0].contactId);
      });

      it('チャットサーバーURLが含まれる', function() {
        chatServerUrl = result.chat_request.live_server;
        expect(typeof(chatServerUrl)).toBe('string');
        expect(chatServerUrl).toBeTruthy();
      });

      it('チャットルームIDが含まれる', function() {
        chatRoomId = result.chat_request.chatroom_id;
        expect(typeof(chatRoomId)).toBe('string');
        expect(chatRoomId).toBeTruthy();
      });
    });

    it('通知で受けとったチャットサーバーに接続できる', function() {

      socket2 = io.connect(chatServerUrl, socketOption);
      socket2.on('connect', function(data) {
        connected = true;
      });
      socket2.on('error', function() {
        gotError = true;
      });
      socket2.on('disconnect', function() {
        disconnected = true
      });

      waitsFor(function() {
        return connected || gotError || disconnected;
      }, 5000, 'チャットサーバーに接続');

      runs(function() {
        expect(connected).toBe(true);
        expect(disconnected).toBe(false);
        expect(gotError).toBe(false);
      });
    });

    it('チャット開始状態になる', function() {

      socket2.on('chat_start', function() {
        started = true;
      });

      socket2.emit('request_chat', {
        contactId: callerContactId,
        chatRoomId: chatRoomId
      });

      waitsFor(function() {
        return started || gotError || disconnected;
      }, 5000, 'チャット開始状態になる');

      runs(function() {
        expect(connected).toBe(true);
        expect(started).toBe(true);
        expect(disconnected).toBe(false);
        expect(gotError).toBe(false);
      });
    });
  });

  describe('tear down', function() {


    it('相手を待つのをやめる', function() {
      socket1.disconnect();
      socket2.disconnect();

//      waitsFor(function() {
//        return gotError || disconnected;
//      }, 5000, 'チャット切断');

      runs(function() {
//        expect(disconnected).toBe(true);
//        expect(gotError).toBe(false);
      });

    });
  });

});
  
