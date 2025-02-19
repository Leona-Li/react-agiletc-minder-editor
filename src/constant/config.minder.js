const config = {
    // 放大缩小比例
    zoom: [10, 20, 30, 50, 80, 100, 120, 150, 200],
    tag: {
        0: {
            text: '未处理',
            color: '#EE2C2C'
        },
        1: {
            text: '已处理',
            color: '#9ACD32'
        },
        2: {
            text: '无需处理',
            color: '#8B8989'
        },
    },
    commentType: {
        1: '需求不明确',
        2: '需求合理性',
        3: '遗漏异常情况',
        4: '遗漏场景测试',
        5: '边界值',
        6: '测试数据',
        7: '安全性相关',
        8: '体验优化改进',
        9: '测试点编写改进',
        0: '其他'
    },
    template: ['default', 'structure', 'filetree', 'right', 'fish-bone', 'tianpan'],
    theme: {
        'classic': {
            key: '脑图经典',
            background: 'rgb(233, 223, 152)',
            color: 'rgb(68, 51, 0)',
            radius: '15px'
        },
        'classic-compact': {
            key: '紧凑经典',
            background: 'rgb(233, 223, 152)',
            color: 'rgb(68, 51, 0)',
            radius: '15px'
        },
        'fresh-blue': {
            key: '天空蓝',
            background: 'rgb(115, 161, 191)',
            color: '#fff',
            radius: '2.5px'
        },
        'fresh-blue-compat': {
            key: '紧凑蓝',
            background: 'rgb(115, 161, 191)',
            color: '#fff',
            radius: '2.5px'
        },
        'fresh-green': {
            key: '文艺绿',
            background: 'rgb(115, 191, 118)',
            color: '#fff',
            radius: '2.5px'
        },
        'fresh-green-compat': {
            key: '紧凑绿',
            background: 'rgb(115, 191, 118)',
            color: '#fff',
            radius: '2.5px'
        },
        'fresh-pink': {
            key: '脑残粉',
            background: 'rgb(191, 115, 148)',
            color: '#fff',
            radius: '2.5px'
        },
        'fresh-pink-compat': {
            key: '紧凑粉',
            background: 'rgb(191, 115, 148)',
            color: '#fff',
            radius: '2.5px'
        },
        'fresh-purple': {
            key: '浪漫紫',
            background: 'rgb(123, 115, 191)',
            color: '#fff',
            radius: '2.5px'
        },
        'fresh-purple-compat': {
            key: '紧凑紫',
            background: 'rgb(123, 115, 191)',
            color: '#fff',
            radius: '2.5px'
        },
        'fresh-red': {
            key: '清新红',
            background: 'rgb(191, 115, 115)',
            color: '#fff',
            radius: '2.5px'
        },
        'fresh-red-compat': {
            key: '紧凑红',
            background: 'rgb(191, 115, 115)',
            color: '#fff',
            radius: '2.5px'
        },
        'fresh-soil': {
            key: '泥土黄',
            background: 'rgb(191, 147, 115)',
            color: '#fff',
            radius: '2.5px'
        },
        'fresh-soil-compat': {
            key: '紧凑黄',
            background: 'rgb(191, 147, 115)',
            color: '#fff',
            radius: '2.5px'
        },
        'snow': {
            key: '温柔冷光',
            background: 'rgb(233, 223, 152)',
            color: 'rgb(68, 51, 0)',
            radius: '2.5px'
        },
        'snow-compact': {
            key: '紧凑冷光',
            background: 'rgb(233, 223, 152)',
            color: 'rgb(68, 51, 0)',
            radius: '2.5px'
        },
        'tianpan': {
            key: '经典天盘',
            background: 'rgb(233, 223, 152)',
            color: 'rgb(68, 51, 0)',
            radius: '15px'
        },
        'tianpan-compact': {
            key: '紧凑天盘',
            background: 'rgb(233, 223, 152)',
            color: 'rgb(68, 51, 0)',
            radius: '15px'
        },
        'fish': {
            key: '鱼骨图',
            background: 'rgb(233, 223, 152)',
            color: 'rgb(68, 51, 0)',
            radius: '15px'
        },
        'wire': {
            key: '线框',
            background: '#fff',
            color: 'rgb(68, 51, 0)',
            radius: '15px'
        },
    },
    commonColor: [
        [
            '#ffffff', '#000000', '#eeece1', '#1f497d', '#4f81bd',
            '#c0504d', '#9bbb59', '#8064a2', '#4bacc6', '#f79646'
        ],
        [
            '#f2f2f2', '#808080', '#ddd8c2', '#c6d9f1', '#dbe5f1',
            '#f2dbdb', '#eaf1dd', '#e5dfec', '#daeef3', '#fde9d9'
        ],
        [
            '#d9d9d9', '#595959', '#c4bc96', '#8db3e2', '#b8cce4',
            '#e5b8b7', '#d6e3bc', '#ccc0d9', '#b6dde8', '#fbd4b4'
        ],
        [
            '#bfbfbf', '#404040', '#938953', '#548dd4', '#95b3d7',
            '#d99594', '#c2d69b', '#b2a1c7', '#92cddc', '#fabf8f'
        ],
        [
            '#a6a6a6', '#262626', '#4a442a', '#17365d', '#365f91',
            '#943634', '#76923c', '#5f497a', '#31849b', '#e36c0a'
        ],
        [
            '#7f7f7f', '#0d0d0d', '#1c1a10', '#0f243e', '#243f60',
            '#622423', '#4e6128', '#3f3151', '#205867', '#974706'
        ]
    ],
    standardColor: [
        '#c00000', '#ff0000', '#ffc000', '#ffff00', '#92d050',
        '#00b050', '#00b0f0', '#0070c0', '#002060', '#7030a0'
    ],
    reviewTag:  '待审',
    reviewedTag: '已审',
    resourceColor: [{ bgColor: '#BF1E1B', fontColor: '#FFF' }, { bgColor: '#7a00f2', fontColor: '#FFF' }, { bgColor: '#2760f2', fontColor: '#FFF' }, { bgColor: '#63ABF7', fontColor: '#FFF' },
    { bgColor: '#71CB2D', fontColor: '#FFF' }, { bgColor: '#50c28b', fontColor: '#FFF' }, { bgColor: '#FF9F1A', fontColor: '#FFF' }, { bgColor: '#30BFBF', fontColor: '#FFF' }, { bgColor: '#444444', fontColor: '#FFF' },
    { bgColor: '#6d6d6d', fontColor: '#FFF' }, { bgColor: '#F4F4F4', fontColor: '#333333' }, { bgColor: '#D6F0F8', fontColor: '#276F86' }
    ],
    customCtTheme: {
        'background': '#FAFBFC',

        'root-color': '#202D40',
        'root-background': '#F4F8FF',
        'root-stroke': '#7CA3FF',
        'root-stroke-width': 1.5,
        'root-font-size': 16,
        'root-padding': [12, 24],
        'root-margin': [30, 100],
        'root-radius': 5,
        'root-space': 10,

        'main-color': '#202D40',
        'main-background': '#F4F8FF',
        'main-stroke': '#7CA3FF',
        'main-stroke-width': 1.5,
        'main-font-size': 13,
        'main-padding': [8, 20],
        'main-margin': 20,
        'main-radius': 3,
        'main-space': 5,

        'sub-color': 'black',
        'sub-background': 'transparent',
        'sub-stroke': 'none',
        'sub-font-size': 12,
        'sub-padding': [5, 10],
        'sub-margin': [15, 20],
        'sub-radius': 5,
        'sub-space': 5,

        'connect-color': 'rgb(83, 134, 254,0.8)',
        'connect-width': 1,
        'connect-radius': 5,

        'selected-stroke': '#5386FE',
        'selected-stroke-width': 3,
        // 'blur-selected-stroke': hsl(h, 10, 60),

        // 'marquee-background': hsl(h, 100, 80).set('a', 0.1),
        // 'marquee-stroke': hsl(h, 37, 60),

        // 'drop-hint-color': hsl(h, 26, 35),
        // 'drop-hint-width': 5,

        // 'order-hint-area-color': hsl(h, 100, 30).set('a', 0.5),
        // 'order-hint-path-color': hsl(h, 100, 25),
        // 'order-hint-path-width': 1,

        'text-selection-color': '#202D40',
        'line-height':1.5
    }
}

export default config;
