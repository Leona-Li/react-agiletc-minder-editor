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
    tags={['前置条件', '步骤', '预期']}
    tagDisabledCheck={()=> {
      const selectedNode = window.minder.getSelectedNode()
      const selectedNodeData = selectedNode && selectedNode.getData()

      if (!selectedNodeData) return true
      const resource = selectedNodeData ? selectedNodeData.resource : null

      return !(selectedNodeData.type === "case" || (resource && resource.indexOf('用例') > -1))
    }}
    data={{
        "root": {
          "data": {
            "text": "test111",
            isApp: true,
          },
          "children": [
            { "data": { "text": "地图" } },
            { "data": { "text": "百科", "expandState": "collapse" } }
          ]
        },
      }}
    type = ""
    theme="fresh-green"
/>
render(<App />, document.getElementById('root'))
