import * as React from 'react';
import './App.less';
import 'kity';
import './assets/kityminder-core/kityminder.core.js';
import './assets/kityminder-core/kityminder.core.css';
import * as editorCommand from './command/EditorCommand';
import config from './constant/config.minder';
import { isCaseData } from './common/helpers/utils';
import HotBox from './model/HotBox';
import History from './model/History';
import ToolBox from './model/ToolBox';
import Runtime from './model/Runtime';
import Navigator from './model/Navigator';
import NoteRender from './pages/NoteRender';
import SearchRenderV2 from './pages/SearchRenderV2';
import NavigatorRender from './pages/NavigatorRender';
import ClipBoard from './model/ClipBoard';
import Mind from './pages/Mind';
import Exterior from './pages/Exterior';
import ShotCutModal from './pages/ShotCut';
import { Input, Tabs, notification, Button, Icon, Spin, Tooltip, Switch, Drawer } from 'antd';
import { isUndefined, isArray, endsWith } from 'lodash';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      url: '',
      editText: "",
      // 使用的资源
      usedResource: [],
      // 节点信息
      nodeInfo: {
        id: '',
        text: '',
        note: '',
        hyperlink: {},
        image: {},
        timeStamp: String(new Date().getTime())
      },
      // 是否选中节点
      isNode: false,
      // 主题
      theme: props.theme || 'fresh-blue-compat',
      // 模板
      template: props.template || 'right',
      // 是否存在撤销
      hasUndo: false,
      // 是否存在重做
      hasRedo: false,
      // 工具箱的显示状态
      toolbox: true,
      // 工具箱的
      toolboxTab: 'review',

      showTip: false,   //是否显示结果文字
      curIndex: 0,   // 当前处于第一条
      resultNum: 0,  // 搜索结果共几条
      zoom: 100,
      triggerActive: true,
      fullScreen: false,
      tags: props?.tags || [],
      expand: true,
      readOnly: props.readOnly || false,
      spinning: false, // 加载中
      caseId: '',
      recordId: '',
      editUsers: [],
      isScore: '0',
      minderStatus: "normal",
      searchDrawerVisible: false,
    },
      this.baseVersion = 0;
    window.editor = {};
    this.timeoutObj = null;
    this.SPLITOR = '\uFEFF';
    this.isFirst = true;

    kityminder.Theme.register('custom-ct', config.customCtTheme)
  }

  componentWillUnmount = () => {
    // 清除掉定时上报心跳的定时任务
    if (this.timeoutObj != null) {
      clearInterval(this.timeoutObj);
      this.timeoutObj = null;
    }
    // 去掉复制粘贴的listener
    window.editor.clipBoard.unMount();
  }


  componentDidMount = () => {
    // this.setState({
    //   caseId: urls[5],
    //   recordId: urls[6],
    //   isScore: urls[7],
    //   userName: this.userName
    // })

    editorCommand.importJson(this.props.data)
    editorCommand.handleTemplate(this.state.template)
    // 将实例化对象 传回给父组件
    if (this.props.editorRef) {
      this.props.editorRef(this);
    }

    if (!isUndefined(this.props.tags)) {
      this.setState({
        tags: this.props.tags
      })
    }

    window.editor = {
      runtime: new Runtime(this),
      hotbox: new HotBox(this),
      history: new History(this),
      clipBoard: new ClipBoard(this),
      toolbox: new ToolBox(this),
      navigator: new Navigator(this)
    }
  }


  // componentWillReceiveProps = (nextProps) => {
  //   // 处理当前用户不是编辑人的情况
  //   if (nextProps.type === '' && JSON.stringify(nextProps.editor) !== JSON.stringify(this.props.editor)) {
  //     if (nextProps.editor.indexOf(this.userName) === -1) {
  //       window.minder.disable()
  //       this.setState({
  //         minderStatus: 'disabled'
  //       })
  //     }

  //   }
  // }


  /**
   * 处理所有state状态
   */
  handleState = (type, value) => {
    if (type === 'nodeInfo') {
      this.setState({
        nodeInfo: value,
        isNode: value.id === '' ? false : true
      })
    } else {
      this.setState({
        [type]: value
      })
    }
  }

  handleChange = (value) => {
    this.setState({
      editText: value
    })
  }


  getEditText = () => {
    return this.state.editText;
  }


  /**
   * 返回所有的数据
   */
  getAllData = () => {
    let root = editorCommand.exportJson();
    root.base = this.baseVersion;
    return root;
  }



  /**
   * 设置编辑器的数据
   * @param {*} value
   */
  setEditerData = (value) => {
    editorCommand.importJson(value)
  }


  /**
   * 处理服务端的ws的数据
   * @param {} message
   * @returns
   */
  handleWsData = (message) => {
    // 收到当前用户的数据
    if (message.substring(0, 4) === '当前用户') {
      notification.warn({
        message,
      })
    } else if (message.substring(0, 1) === '2') {
      // 消息回复的信息处理

    } else {
      if (message === 'ping ping ping') {
        this.sendMessage('0pong pong pong')
        return;
      }
      try {
        let minderData = JSON.parse(message);
        // 区别是更新 还是加载一个新的文件
        if (isArray(minderData)) {
          if (isArray(minderData[0])) {
            if (minderData[0][0].value > parseInt(this.baseVersion)) {
              this.baseVersion = minderData[0][0].value
            }


          } else {
            let temp = minderData.filter(item => item.path === '/base')
            if (temp[0].value !== (parseInt(this.baseVersion) + 1)) {
              alert("版本信息不正确, 请刷新页面同步数据！！！， 否则会导致数据丢失");
            } else {
              this.baseVersion = temp[0].value
              window.editor.history.isSync = true;
              editorCommand.applyPatches(minderData);
              // 这里如果是任务执行的情况下 还需要同步任务结果数据
              if (this.props.type === 'record') {
                // 如果是任务执行，需要去回调这个结果
                this.onResultChange();

              }
            }
          }

        } else {
          if (minderData.type === 'all_users') {
            // 这里处理用户信息的地方
            this.setState({
              editUsers: minderData.data
            })
          } else {
            // websocket 链接后的第一次数据传输
            this.baseVersion = minderData.base
            editorCommand.importJson(minderData, this.isFirst);
            this.isFirst = false;
          }



        }

      } catch (e) {
        // 这里需要处理异常
      }
    }
  }


  /**
   * 发送补丁数据
   */
  sendPatch = (diff) => {
    if (this.state.editUsers.length > 1) {
      // 如果说编辑的人超过了1人的话 部分的样式修改 ，需要把它过滤掉
      diff = diff.filter(item => {
        return !endsWith(item.path, "layout") &&
          !endsWith(item.path, "layout_right_offset") &&
          !endsWith(item.path, "expandState") &&
          !endsWith(item.path, "layout_right_offset/y") &&
          !endsWith(item.path, "layout_right_offset/x")
      })
    }

    // this.sendMessage("1" + JSON.stringify({ case: this.getAllData(), patch: [diff], }))
  }


  /**
   * 使脑图不可用
   */
  disableMinder = () => {
    editorCommand.disableMinder();
    this.setState({
      minderStatus: 'disabled'
    })
  }


  /**
   * 脑图可用
   */
  enableMinder = () => {
    editorCommand.enableMinder();
    this.setState({
      minderStatus: 'normal'
    })
  }

  handleEditPaste = (e) => {
    var clipBoardEvent = e;
    try {
      // 提取出里面的文本内容
      let pasteText = "";
      var textData = clipBoardEvent.clipboardData.getData('text/plain');
      if (textData.indexOf(this.SPLITOR) !== -1) {
        const data = textData.split(this.SPLITOR);
        let nodes = JSON.parse(data[1]);

        for (const item of nodes) {
          if (pasteText !== '') {
            pasteText += "\n";
          }
          pasteText += item.data.text
        }
        this.setState({
          editText: this.state.editText === '' ? pasteText : (this.state.editText + "\n" + pasteText)
        })
        e.preventDefault();
      }
    } catch (e) {
      console.log(e);
    }
  }


  onMindRef = (ref) => {
    this.mindRef = ref;
  }

  /**
   * 设置mind的超链接弹出框可见
   */
  setMindHyperLinkVisible = () => {
    this.mindRef.setHyperlink(true);
  }

  /**
   * 获取到record搜索数据的上下文
   */
  onRecordSearchRef = (ref) => {
    this.recordStatusSearchRef = ref;
  }


  /**
   * 执行结果数据发生改变时
   */
  onResultChange = () => {
    if (this.props.onResultChange) {
      this.props.onResultChange();
    }

    if (this.state.searchDrawerVisible && this.props.type === 'record'
      && this.recordStatusSearchRef.state.recordStatus !== ''
    ) {
      this.recordStatusSearchRef.handleChange(this.recordStatusSearchRef.state.recordStatus);
    }
  }

  isCaseOfSelNode = () => {
    const sel = window?.minder?.getSelectedNode();
    return sel && isCaseData(sel.data);
  }

  render() {
    const operations =
      <React.Fragment>
        <ShotCutModal>
          <Tooltip placement="top" title={'快捷键'}>
            <Icon type="question-circle" />
          </Tooltip>
        </ShotCutModal>
      </React.Fragment>
      ;

    return (
      <div id='kityminder-editor' style={this.props.editorStyle} className="kityminder-editor-container kityminder-editor">
        {/* {
          this.props.type !== 'compare' && this.props.type !== 'backup' &&
          <Websocket
            debug={true}
            url={this.props.wsUrl}
            onOpen={this.handleWsOpen}
            onClose={this.handleWsClose}
            onMessage={this.handleWsData}
            onError={(e) => {
              notification.warn({
                message: "websocket连接错误"
              })
            }}
            ref={Websocket => {
              this.refWebSocket = Websocket;
              window.websocket = Websocket;
            }}
          />
        } */}
        <NoteRender />

        {
          this.state.searchDrawerVisible && <SearchRenderV2
            onRecordSearchRef={this.onRecordSearchRef}
            visible={this.state.searchDrawerVisible}
            handleState={this.handleState}
            recordId={this.state.recordId}
            type={this.props.type}
            expand={this.state.expand}
          >
          </SearchRenderV2>
        }

        <NavigatorRender
          zoom={this.state.zoom}
          triggerActive={this.state.triggerActive}
          fullScreen={this.state.fullScreen}
        />
        {

          <Tabs defaultActiveKey={this.props.type === 'compare' ? 'exterior' : 'mind'} size='small' className='editor-tabs' tabBarExtraContent={operations}>
            {
              this.props.type === 'compare' ? null :
                <Tabs.TabPane tab='思路' key='mind' >
                  <Mind
                    {...this}
                    onRef={this.onMindRef}
                    usedResource={this.state.usedResource}
                    isNode={this.state.isNode}
                    nodeInfo={this.state.nodeInfo}
                    history={window.editor.history}
                    editable={true}
                    hasUndo={this.state.hasUndo}
                    hasRedo={this.state.hasRedo}
                    tags={this.state.tags}
                    tagDisabledCheck={this.props.tagDisabledCheck}
                    expand={this.state.expand}
                    uploadUrl={this.props.uploadUrl}
                    readOnly={this.state.readOnly}
                    fullScreen={this.state.fullScreen}
                    handleState={this.handleState}
                    onResultChange={this.onResultChange}
                  />
                </Tabs.TabPane>
            }

            <Tabs.TabPane tab='外观' key='exterior'>
              <Exterior
                handleState={this.handleState}
                theme={this.state.theme}
                template={this.state.template}
                expand={this.state.expand}
                type={this.props.type}
                minderStatus={this.state.minderStatus}
              />
            </Tabs.TabPane>
          </Tabs>
        }


        <div id='kityminder-core' tabIndex={-1} className='kityminder-core-container focus'
          ref={(input) => {
            if (!this.minder) {
              this.minder = new window.kityminder.Minder({
                renderTo: input,
                enableAnimation: false,
                defaultTheme: this.state.theme,
              });
              window.minder = this.minder;
              window.minder.type = (this.props.type === 'compare' || this.props.type === 'record' || this.props.type === 'backup') ? 'disable' : '';
            }
          }}>

          <Spin spinning={this.state.spinning} style={{ position: 'absolute', width: '100%', marginTop: 300, zIndex: 10002 }} />

          <Button type='primary' className='save-btn' onClick={this.props.save}>保存</Button>

          <div
            id='node-input-container'
            style={{ display: 'none', maxWidth: '300px', marginLeft: this.isCaseOfSelNode() ? '40px' : 0 }}
            className='m-input'>
            <Input.TextArea
              id='core-node-input-disableKeydown'
              value={this.state.editText}
              onChange={
                e => this.handleChange(e.target.value)
              }
              onPaste={
                e => this.handleEditPaste(e)
              }
              autoSize={{ minRows: 1, maxRows: 10 }}
            />
          </div>
        </div>

      </div>
    )
  }

}


export default App
