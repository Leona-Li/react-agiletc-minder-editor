import * as React from 'react';
import { Icon, Menu, Dropdown, Popover, Tooltip, Button, Select, Tag } from 'antd';
import { isGroupData, isAppData, isCaseData, isDisableNode, isTagEnable } from '../../common/helpers/utils';
import './style.less';
import { partial, isEmpty, isUndefined, isString } from 'lodash';
import * as editorCommand from '../../command/EditorCommand';
import HyperLink from './HyperLink';
import NodeLink from './NodeLink';
import ImageUpload from './Image';
import ColorPicker from './ColorPicker';
const { Option } = Select;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hyperlink: false,
            nodeLink: false,
            image: false,
            fontColor: '#000',
            bgColor: 'rgb(115, 161, 191)',
            hasNodeSelected: false,
            nodeInfo: {
                hyperlink: ''
            },
            currentResource: [],
            image: false,
        }
    }


    componentDidMount = () => {
        this.props.onRef(this)
    }


    componentWillReceiveProps = (nextProps) => {
        if (nextProps.nodeInfo.id !== this.props.nodeInfo.id) {
            nextProps.handleState('usedResource', window.minder.getUsedResource())
            this.setState({
                currentResource: nextProps.isNode ? editorCommand.getResource() === null ? [] : editorCommand.getResource() : []
            })
        }
    }



    setHyperlink = (visible) => {
        this.setState({
            hyperlink: visible
        })
    }

    setNodeLink = (visible) => {
        this.setState({
            nodeLink: visible
        })
    }

    setImage = (visible) => {
        this.setState({ image: visible });
    }


    handleHyperlink = () => {
        editorCommand.handleHyperlink({ url: null, title: '' });
        //更新其中的值
        // window.editor.runtime.nodeInfo = { url: null, title: '' };
    }

    handleNodeLink = () => {
        editorCommand.handleNodeLink("");
    }


    handlePriority = (value) => {
        editorCommand.handlePriority(value);
    }


    /**
     * 设置背景颜色
     * @param {*} color
     */
    setBgColor = (color) => {
        // if (!this.props.editable) return;
        this.setState({ bgColor: color });
        editorCommand.handleBgColor(color);
    }


    /**
     * 设置字体颜色
     * @param {}} color
     */
    setFontColor = (color) => {
        this.setState({ fontColor: color });
        editorCommand.handleForeColor(color);
    }

    /**
     * 清除样式
     */
    handleClear = () => {
        editorCommand.handleClear();
    }

    onTagSelect = (value) => {

        let temp = JSON.parse(JSON.stringify(this.state.currentResource));
        let isMatch = false;
        for (const item of temp) {
            let name = isString(item) ? item : item.name;
            isMatch = value == name || value.name == name;
            if (isMatch) {
                break
            }
        }

        if (isMatch) {
            this.onTagDeSelect(value);
        } else {
            temp.push(value);
            editorCommand.handleResource(value, 0);
            this.setState({
                currentResource: temp
            })
        }

        // if (this.state.usedResource.indexOf(value) === -1) {
        //     let temp = JSON.parse(JSON.stringify(this.state.usedResource));
        //     temp.push(value);
        //     this.setState({
        //         currentResource: temp
        //     })
        // }

    }


    onTagDeSelect = (value) => {
        let temp = JSON.parse(JSON.stringify(this.state.currentResource));
        temp = temp.filter(item => {
            if (isString(value)) {
                return item !== value && item.name !== value;
            } else {
                return item !== value.name && item.name !== value.name;
            }

        })
        editorCommand.handleResource(value, 1);
        this.setState({
            currentResource: temp
        })
    }


    onTagFouce = () => {

    }

    tagCommandDisabled = () => {
        let minder = window.minder;
        if (!minder) return true;

        let node = minder.getSelectedNode();
        if (node && node?.data?.allowDisabledTag) {
          return false;
        }
        if (isDisableNode(minder) && !isTagEnable(minder)) {
          return true;
        }
        if (this.props.tagDisabledCheck) {
          return this.props.tagDisabledCheck();
        }
        return minder.queryCommandState && minder.queryCommandState('resource') === -1;
    }

    renderTags = () => {
        const { isNode, tags } = this.props;

        if (!isUndefined(window.minder)) {
            const isDisabled = this.tagCommandDisabled();
            return tags.map(item => {
                let color = window.minder.getResourceColor(item).toHEX();
                return <Tag
                    onClick={() => { !isDisabled && this.onTagSelect(item) }}
                    className={`resource-tag ${!isDisabled ? '' : 'disabled'}`}
                    color={color}
                >{item}</Tag>
            })
        }
    }

    setSearch = (visible) => {
        this.props.handleState('searchDrawerVisible', visible);
    }


    handleImage = () => {
        editorCommand.handleImage({ url: null, title: '' });
        setTimeout(() => {
            window.minder.fire('contentchange');
        }, 500)
    }



    /**
     * 打开备注
     */
    setNote = () => {
        this.props.handleState('toolbox', true);
        this.props.handleState('toolboxTab', 'note')
    }

    /**
     * 设置执行结果
     * @param {*} key
     */
    handleExecuteResult = (key) => {
        editorCommand.handleExecutor(key === 0 ? "" : this.props.userName);
        editorCommand.handleResult(key);
        if (this.props.onResultChange) {
            this.props.onResultChange();
        }
    }

    /**
     * 反选
     */
    selectRevert = () => {
        let selected = minder.getSelectedNodes();
        let selection = [];
        minder.getRoot().traverse(function (node) {
          if (selected.indexOf(node) == -1) {
            selection.push(node);
          }
        });
        minder.select(selection, true);
        minder.fire('receiverfocus');
    }

    /**
     * 选择兄弟节点
     */
    selectSiblings = () => {
        const selected = minder.getSelectedNodes();
        const selection = [];
        selected.forEach(function (node) {
          if (!node.parent) return;
          node.parent.children.forEach(function (sibling) {
            if (selection.indexOf(sibling) == -1) selection.push(sibling);
          });
        });
        minder.select(selection, true);
        minder.fire('receiverfocus');
    }

    /**
     * 选择子树
     */
    selectTree = () => {
        const selected = minder.getSelectedNodes();
        const selection = [];
        selected.forEach(function (parent) {
          parent.traverse(function (node) {
            if (selection.indexOf(node) == -1) selection.push(node);
          });
        });
        minder.select(selection, true);
        minder.fire('receiverfocus');
    }

    appendDisabled = () => {
        try {
            if (!window.minder) return true;
        } catch (e) {
            // 如果window的还没挂载minder，先捕捉undefined异常
            return true
        }

        let node = minder.getSelectedNode();
        const {type} = node?.data || {};

        if (!node) {
            return true;
        }

        if (type === "group") {
            return !isGroupData(node.data)
        } else if(type==="case"){
            return !isGroupData(node.data) || isAppData(node.data) //非目录节点，或应用节点，禁用插入用例
        }

        return false;
    }

    isCaseNode = () => {
        let node = window.minder?.getSelectedNode();

        return isCaseData(node?.data || {});
    }

    render() {
        const { isNode, nodeInfo, hasUndo, hasRedo } = this.props;

        const { hyperlink, image, fontColor, bgColor, nodeLink } = this.state;

        const priorityList = [];
        for (let i = 0; i < 4; i++) {
            priorityList.push(
                <Button
                    disabled={!this.isCaseNode()}
                    onClick={partial(this.handlePriority, i + 1)}
                    type='link'
                    size='small'
                    className={'priority-btn p' + String(i + 1)}
                >
                    P{i}
                </Button>
            );
        }

        return (
            <div className='minder-container' style={{ height: this.props.expand ? '80px' : '0px' }}>
                <Dropdown
                    overlay={<Menu>
                        <Menu.Item><a onClick={partial(editorCommand.handleExpand, 1)}>展开到一级节点</a></Menu.Item>
                        <Menu.Item><a onClick={partial(editorCommand.handleExpand, 2)}>展开到二级节点</a></Menu.Item>
                        <Menu.Item><a onClick={partial(editorCommand.handleExpand, 3)}>展开到三级节点</a></Menu.Item>
                        <Menu.Item><a onClick={partial(editorCommand.handleExpand, 4)}>展开到四级节点</a></Menu.Item>
                        <Menu.Item><a onClick={partial(editorCommand.handleExpand, 5)}>展开到五级节点</a></Menu.Item>
                        <Menu.Item><a onClick={partial(editorCommand.handleExpand, 6)}>展开到六级节点</a></Menu.Item>
                        <Menu.Item><a onClick={partial(editorCommand.handleExpand, 99)}>全部展开</a></Menu.Item>
                    </Menu>}
                >
                    <div><a className='block km-btn-item expand' /><span>展开</span><Icon className='caret' type='caret-down' /></div>
                </Dropdown>

                <Dropdown
                    overlay={<Menu>
                        <Menu.Item><a onClick={this.selectRevert}>反选</a></Menu.Item>
                        <Menu.Item><a onClick={this.selectSiblings}>选择兄弟节点</a></Menu.Item>
                        <Menu.Item><a onClick={this.selectTree}>选择子树</a></Menu.Item>
                    </Menu>}
                >
                    <div><a className='block km-btn-item expand' /><span>全选</span><Icon className='caret' type='caret-down' /></div>
                </Dropdown>

                <div className='inline'>
                    <Button
                        onClick={() => {
                            window.editor.runtime.handleAppend("childNode", '分之主题');
                            editorCommand.handleResource('目录', 0)

                            let selectedNode = minder.getSelectedNode();
                            selectedNode.setData('type', 'group');
                        }}
                        disabled={this.appendDisabled()}
                        type='link'
                        icon='left-circle'
                        size='small'
                    >
                        插入目录
                    </Button>
                    <Button
                        onClick={() => {
                            window.editor.runtime.handleAppend("childNode", '分之主题');
                            editorCommand.handleResource('用例', 0)
                            minder.execCommand('Priority', 1); //默认P0

                            let selectedNode = minder.getSelectedNode();
                            selectedNode.setData('type', 'case');
                        }}
                        type='link'
                        icon='right-circle'
                        size='small'
                        disabled={this.appendDisabled()}
                    >
                        插入用例
                    </Button>
                </div>

                <Button
                    onClick={() => {
                        editorCommand.handleRemove();
                    }}
                    type='link'
                    icon='right-circle'
                    size='small'
                    disabled={() => {
                        const node = minder.getSelectedNode();
                        return !node?.data?.isApp
                    }}
                >
                    删除
                </Button>

                {
                    // 执行用例的结果
                    this.props.readOnly ? <div className='inline' style={{ width: 150 }}>
                        <Tooltip placement="top" title={'移除结果'}>
                            <Button onClick={() => { this.handleExecuteResult(0) }} type='link' style={{ padding: "0px 3px" }}>
                                <i aria-label="图标: minus-circle" className="anticon anticon-minus-circle" style={{ fontSize: "18px", color: "rgba(0, 0, 0, 0.6)" }}><svg viewBox="64 64 896 896" focusable="false" className="" data-icon="minus-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm192 472c0 4.4-3.6 8-8 8H328c-4.4 0-8-3.6-8-8v-48c0-4.4 3.6-8 8-8h368c4.4 0 8 3.6 8 8v48z"></path></svg></i>
                            </Button>
                        </Tooltip>

                        <Tooltip placement="top" title={'失败'}>
                            <Button onClick={() => { this.handleExecuteResult(1) }} type='link' style={{ padding: "0px 3px" }}>
                                <i aria-label="图标: fail" className="anticon anticon-fail" style={{ width: "18px", height: "18px" }}><svg viewBox="0 0 1024 1024" width="18" height="18" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M0 512A512 512 0 1 0 512 0 512 512 0 0 0 0 512z" fill="#FFED83" fillOpacity="1" data-spm-anchor-id="a313x.7781069.0.i41"></path><path d="M782.826255 253.254397a37.559846 37.559846 0 0 1 0 51.727156l-465.48949 465.599314a36.571429 36.571429 0 0 1-51.727155-51.727156l465.489489-465.599314a37.559846 37.559846 0 0 1 51.727156 0z" fill="#d81e06" fillOpacity="1" data-spm-anchor-id="a313x.7781069.0.i44"></path><path d="M265.554698 253.254397a37.559846 37.559846 0 0 1 51.727155 0l465.48949 465.48949a36.571429 36.571429 0 0 1-51.727156 51.727155L265.554698 305.091377a37.559846 37.559846 0 0 1 0-51.83698z" fill="#d81e06" fillOpacity="1" data-spm-anchor-id="a313x.7781069.0.i42"></path></svg></i>
                            </Button>
                        </Tooltip>
                        <Tooltip placement="top" title={'通过'}>
                            <Button onClick={() => { this.handleExecuteResult(2) }} type='link' style={{ padding: "0px 3px" }}>
                                <i aria-label="图标: checked" className="anticon anticon-checked" style={{ width: "18px", height: "18px" }}><svg viewBox="0 0 1024 1024" width="18" height="18" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M509.750303 514.249697m-509.750303 0a509.750303 509.750303 0 1 0 1019.500606 0 509.750303 509.750303 0 1 0-1019.500606 0Z" fill="#6AC259" fillOpacity="1"></path><path d="M250.957576 537.05697a19.859394 19.859394 0 0 1 0-28.780606l28.780606-28.780606a19.859394 19.859394 0 0 1 28.780606 0l2.01697 2.094545 113.105454 121.250909a9.929697 9.929697 0 0 0 14.351515 0L713.69697 317.129697h2.094545a19.859394 19.859394 0 0 1 28.780606 0l28.780606 28.780606a19.859394 19.859394 0 0 1 0 28.780606l-328.921212 341.333333a19.859394 19.859394 0 0 1-28.780606 0L254.991515 543.030303z" fill="#FFFFFF" fillOpacity="1"></path></svg></i>
                            </Button>
                        </Tooltip>

                        <Tooltip placement="top" title={'阻塞'}>
                            <Button onClick={() => { this.handleExecuteResult(3) }} type='link' style={{ padding: "0px 3px" }}>
                                <i aria-label="图标: block" className="anticon anticon-block" style={{ width: "18px", height: "18px" }}><svg viewBox="0 0 1024 1024" width="18" height="18" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M512 1024A511.99872 511.99872 0 1 0 468.650775 1.794556 512.169386 512.169386 0 0 0 0.00128 512.00128a511.99872 511.99872 0 0 0 511.99872 511.99872z" fill="#FFFFFF" fillOpacity="1"></path><path d="M512 938.66688A426.6656 426.6656 0 1 0 511.914667 85.250347 426.6656 426.6656 0 0 0 512 938.66688z" fill="#d81e06" fillOpacity="1"></path><path d="M512 938.66688a426.6656 426.6656 0 0 0 426.6656-426.6656H85.3344a426.6656 426.6656 0 0 0 426.6656 426.6656z" fill="#FFED83" fillOpacity="1" data-spm-anchor-id="a313x.7781069.0.i5"></path></svg></i>
                            </Button>
                        </Tooltip>

                        <Tooltip placement="top" title={'不适用'}>
                            <Button onClick={() => { this.handleExecuteResult(4) }} type='link' style={{ padding: "0px 3px" }}>
                                <i aria-label="图标: skip" className="anticon anticon-skip" style={{ width: "18px", height: "18px" }}><svg viewBox="0 0 1024 1024" width="18" height="18" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M747.3152 415.6416a256.0512 256.0512 0 0 0-489.472 96.768H341.504a170.6496 170.6496 0 0 1 327.6288-58.624l-115.0976 20.9408 227.84 116.736 48.2816-251.392-82.8416 75.5712zM0 512C0 229.2224 229.1712 0 512 0c282.7776 0 512 229.1712 512 512 0 282.7776-229.1712 512-512 512-282.7776 0-512-229.1712-512-512z" fill="#BE96F9" fillOpacity="1" p-id="577"></path></svg></i>
                            </Button>
                        </Tooltip>
                    </div> : null
                }

                {
                    this.props.readOnly ? null : <>
                        <div className='inline' style={{ width: 120 }}>
                            {priorityList}
                        </div>

                        {/* <div className='inline' style={{ width: 45 }}>
                            <div>
                                <Button
                                    onClick={
                                        partial(this.setFontColor, fontColor)
                                    }
                                    style={{ color: fontColor, marginRight: '2px', padding: '0px 2px' }}
                                    type='link'
                                    icon='font-colors'
                                    size='small'
                                    disabled={!isNode}
                                >
                                </Button>
                                <Popover placement='bottomLeft' content={<div><ColorPicker set={this.setFontColor} /></div>} >
                                    <span className='m-icon'>
                                        <Icon className={isNode ? '' : 'icon-disabled'} type='caret-down' />
                                    </span>
                                </Popover>
                            </div>
                            <div>
                                <Button
                                    onClick={partial(this.setBgColor, bgColor)}
                                    style={{ color: bgColor, marginRight: '2px' }}
                                    type='link'
                                    icon='bg-colors'
                                    size='small'
                                    disabled={!isNode}
                                >
                                </Button>
                                <Popover placement='bottomLeft' content={<ColorPicker set={this.setBgColor} />} >
                                    <span className='m-icon'>
                                        <Icon className={isNode ? '' : 'icon-disabled'} type='caret-down' />
                                    </span>
                                </Popover>
                            </div>
                        </div> */}

                        {/* <div className='inline' style={{ width: 80 }}>
                            <Button
                                disabled={!isNode}
                                type='link'
                                size='small'
                                className='big-icon'
                                onClick={partial(this.handleClear)}
                            >
                                <Icon style={{ fontSize: "1.2em" }} type="highlight" />
                                <br />
                                清除样式
                            </Button>
                        </div> */}
                    </>
                }

                {/* <div className='inline' style={{ width: 50 }}>
                    <Button
                        type='link'
                        size='small'
                        className='big-icon'
                        onClick={partial(this.setSearch, true)}
                    >
                        <Icon style={{ fontSize: "1.2em" }} type="search" />
                        <br />
                        搜索
                    </Button>

                </div> */}
                {
                    this.props.readOnly ? null :
                        <div style={{ marginLeft: 5 }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: 5 }}>
                                <div className='inline' style={{ width: 220 }}>
                                    {this.renderTags()}
                                </div>
                            </div>
                        </div>
                }

                <HyperLink
                    nodeInfo={nodeInfo}
                    visible={hyperlink}
                    onCancel={this.setHyperlink}
                />

                <NodeLink
                    nodeInfo={nodeInfo}
                    visible={nodeLink}
                    onCancel={this.setNodeLink}
                >
                </NodeLink>

                <ImageUpload
                    uploadUrl = {this.props.uploadUrl}
                    nodeInfo={nodeInfo}
                    visible={image}
                    onCancel={this.setImage}
                >
                </ImageUpload>
            </div>
        );
    }
}

export default App
