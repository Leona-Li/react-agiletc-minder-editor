import React from 'react'
import { render } from 'react-dom'
import ReactDemo from '../src/App' // 引入组件

const App = () => <ReactDemo
    uploadUrl="/api/file/uploadAttachment"
    wsUrl={`ws://xwcase.gz.cvte.cn/api/case/2244/undefined/0/zsx`}
    onResultChange = {() => {
        console.log("o1nResultChange callback")
    }}
    editorStyle={{ height: 'calc(100vh - 100px)' }}
    readOnly={false}
    editorRef={editorNode => {console.log(editorNode)}}
    onSave={
        () => {
            console.log("sss");
        }
    }
    tags={[
      {text: '目录', color: '#F2870C', type: 'group'},
      {text: '用例', color: '#DA6EF3', type: 'case'},
      {text: '前置条件', color: '#7EC050', type: 'pre-condition', delType: 'step'}
    ]}
    tagDisabledCheck={(tag)=> {
      const selectedNode = window.minder.getSelectedNode()
      const selectedNodeData = selectedNode && selectedNode.getData()

      if (!selectedNodeData) return true
      const resource = (selectedNodeData ? selectedNodeData.resource : []) ||[]

      if (tag.text === '用例' && !selectedNodeData?.isApp) {
        if (!selectedNodeData.type && !resource.includes('用例') && selectedNode?.parent?.data?.type !== 'case') {
          return false;
        }
      }
      if (
        tag.text === '目录' &&
        !selectedNodeData?.isApp &&
        !selectedNodeData.type &&
        !resource.includes('目录') &&
        selectedNode?.parent?.data?.type !== 'case'
      ) {
        return false;
      }

      if (tag.text === '前置条件' && selectedNodeData.type === 'pre-condition') {
        return false
      }

      if (tag.text === '前置条件' && resource.length === 0 && selectedNode?.parent?.data?.type === 'case' && !selectedNode?.children?.length) {
        return false
      }

      return true
    }}
    save={() => {console.log('点击保存了')}}
    data={{
        "root": {
          "data": {
            "text": "test111",
            isApp: true,
          },
          "children": [
            { "data": { "text": "地图" } },
            { "data": { "text": "百科", "expandState": "collapse", priority: 0 } }
          ]
        },
      }}
    type = ""
    theme="custom-ct"
/>
render(<App />, document.getElementById('root'))
