window.CrossDomainCommunicate = (function(){
    //��Ϣǰ׺,
    var prefix = "[PROJECT_NAME]";

    // ��ʼ��CrossDomainCommunicate����
    // ����CrossDomainCommunicateʵ��ʱ, ����ָ��Messenger������
    // ����ҳ����projectName���뱣��һ��, �����޷�ƥ��
    function CrossDomainCommunicate(messengerName, projectName){
        this.targets = {};
        this.name = messengerName;
        this.listenFunc = [];
        this.prefix = projectName || prefix;
        this.initListen();
    }

    //���һ����Ϣ����
    CrossDomainCommunicate.prototype.addTarget = function(target, name){
        var targetObj = new Target(target, name,  this.prefix);
        this.targets[name] = targetObj;
    };

    //Target��, ��Ϣ����
    function Target(target, name, prefix){
        this.target = target;
        this.name = name;
        this.prefix = prefix;
    }

    // ��Ӽ����ص�����
    CrossDomainCommunicate.prototype.addListenFunc = function(callback){
        var i = 0;
        var len = this.listenFunc.length;
        var cbIsExist = false;
        for (; i < len; i++) {
            if (this.listenFunc[i] == callback) {
                cbIsExist = true;
                break;
            }
        }
        if (!cbIsExist) {
            this.listenFunc.push(callback);
        }
    };

    // ��ʼ����Ϣ����
    CrossDomainCommunicate.prototype.initListen = function(){
        var source = this;
        var generalCallback = function(msg){
            if(typeof msg == 'object' && msg.data){
                msg = msg.data;
            }
            var msgPairs = msg.split('__Messenger__');
            var msg = msgPairs[1];
            var pairs = msgPairs[0].split('|');
            var prefix = pairs[0];
            var name = pairs[1];

            for(var i = 0; i < source.listenFunc.length; i++){
                if (prefix + name === source.prefix + source.name) {
                    source.listenFunc[i](msg);
                }
            }
        };

        if ( 'addEventListener' in document ) {
            window.addEventListener('message', generalCallback, false);
        } else if ( 'attachEvent' in document ) {
            window.attachEvent('onmessage', generalCallback);
        }

    };

    // ע������
    CrossDomainCommunicate.prototype.clear = function(){
        this.listenFunc = [];
    };

    Target.prototype.send = function(msg){
        this.target.postMessage(this.prefix + '|' + this.name + '__Messenger__' + msg, '*');
    };
    // ��������ҳ�淢����Ϣ
    CrossDomainCommunicate.prototype.send = function(msg){
        var targets = this.targets,
            target;
        for(target in targets){
            if(targets.hasOwnProperty(target)){
                targets[target].send(msg);
            }
        }
    };
    return CrossDomainCommunicate;
})();
