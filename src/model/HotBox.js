import * as editorCommand from './../command/EditorCommand';
import 'hotbox-ui';
import 'hotbox-ui/hotbox.css'

class HotBoxs {




    constructor(props) {
        this.setProps(props);

        this.hotbox = new window.HotBox("#kityminder-core");
        var main = this.hotbox.state('main');

        const vm = this;

        if (!props.state.readOnly) {
            main.button({
                position: 'center',
                action: function () {
                    // 编辑动作
                    window.editor.runtime.handleEdit();
                },
                label: '编辑',
                key: 'F2',
                next: 'idle'
            });

            main.button({
                position: 'ring',
                action: function () {
                    window.editor.runtime.handleAppend("childNode", '分之主题');
                    editorCommand.handleResource('目录', 0)

                    let selectedNode = minder.getSelectedNode();
                    selectedNode.setData('type', 'group');
                },
                enable: function () {
                    let node = minder.getSelectedNode();

                    if (!node?.data?.isApp && node?.data?.type !== 'group') {  //如果选中的节点是应用，则不给插入用例
                        return false;
                    }

                    return true;
                },
                label: '插入目录',
                key: 'Tab+Shift',
                next: 'idle'
            });

            main.button({
                position: 'ring',
                action: function () {
                    window.editor.runtime.handleAppend("childNode", '分之主题');
                    editorCommand.handleResource('用例', 0)
                    minder.execCommand('Priority', 1); //默认P0

                    let selectedNode = minder.getSelectedNode();
                    selectedNode.setData('type', 'case');
                },
                enable: function () {
                    const node = minder.getSelectedNode();

                    if (!node?.data?.isApp && node?.data?.type !== 'group') {  //如果选中的节点是应用，则不给插入用例
                        return false;
                    }

                    return minder.queryCommandState('AppendChildNode') != -1;
                },
                label: '插入用例',
                key: 'Tab|Insert',
                next: 'idle'
            });

            main.button({
                position: 'ring',
                action: function () {
                    editorCommand.handleRemove();

                },
                enable: function () {
                    const node = minder.getSelectedNode();

                    return !node?.data?.isApp
                },
                label: '删除',
                key: 'Delete',
                next: 'idle'
            });

            main.button({
                position: 'ring',
                action: function () {
                    editorCommand.handleUp();

                },
                label: '前移',
                key: 'Alt+Up',
                next: 'idle'
            });

            main.button({
                position: 'ring',
                action: function () {
                    editorCommand.handleDown();

                },
                label: '后移',
                key: 'Alt+Down',
                next: 'idle'
            });

            main.button({
                position: 'ring',
                action: function () {

                    if (!minder.queryCommandState('expand')) {
                        minder.execCommand('expand');
                    } else if (!minder.queryCommandState('collapse')) {
                        minder.execCommand('collapse');
                    }
                },
                enable: function () {
                    return minder.queryCommandState('expand') != -1 || minder.queryCommandState('collapse') != -1;
                },
                beforeShow: function () {
                    if (!minder.queryCommandState('expand')) {
                        this.$button.children[0].innerHTML = '展开';
                    } else {
                        this.$button.children[0].innerHTML = '收起';
                    }
                },
                key: '/',
                next: 'idle'
            });

            main.button({
                position: 'bottom',
                action: function () {
                    window.editor.history.undo()
                },
                label: '撤销',
                key: 'Ctrl + Z',
                next: 'idle'
            });

            main.button({
                position: 'bottom',
                action: function () {
                    window.editor.history.redo()
                },
                label: '重做',
                key: 'Ctrl + Y',
                next: 'idle'
            });
        } else {
            main.button({
                position: 'ring',
                action: function () {
                    vm.handleExecuteResult(2);
                },
                label: '通过',
                key: '通过',
                next: 'idle'
            });

            main.button({
                position: 'ring',
                action: function () {
                    vm.handleExecuteResult(1);

                },
                label: '失败',
                key: '失败',
                next: 'idle'
            });

            main.button({
                position: 'ring',
                action: function () {
                    vm.handleExecuteResult(4);

                },
                label: '不适用',
                key: '不适用',
                next: 'idle'
            });

            main.button({
                position: 'ring',
                action: function () {
                    vm.handleExecuteResult(3);

                },
                label: '阻塞',
                key: '阻塞',
                next: 'idle'
            });

            main.button({
                position: 'top',
                action: function () {
                    vm.handleExecuteResult(0);
                },
                label: '移除',
                key: 'Del',
                next: 'idle'
            })
        }





    }


    /**
     * 设置执行结果
     * @param {*} key
     */
    handleExecuteResult = (key) => {
        editorCommand.handleResult(key);
        if (this.props.props.onResultChange) {
            this.props.props.onResultChange();
        }

    }


    active = (x, y) => {
        this.hotbox.active('main', { x, y });
    }

    idle = () => {
        this.hotbox.active("idle")
    }


    setProps = (props) => {
        this.props = props;
    }


}

export default HotBoxs;
