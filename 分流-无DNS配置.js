// ==========================================
// 1. 批量生成规则集的“通用模板”
// ==========================================
const ruleProviderCommon = {
  "type": "http",      // 指定通过 HTTP/HTTPS 从网络下载规则文件
  "format": "yaml",    // 规则文件的格式为 YAML
  "interval": 21600    // 更新频率：21600秒（即6小时）自动拉取一次最新规则
};

// 存放所有生成的规则集配置的容器
const ruleProviders = {};

// ==========================================
// 2. 全自动下载分流名单 (Loyalsoldier 基础规则)
// 作用：引入 GitHub 上维护好的庞大黑白名单（如几千个广告域名），避免手动填写的繁琐
// ==========================================
const lsRules = {
  // domain: 按域名匹配的规则（比如苹果服务、谷歌服务、广告拦截 reject 等）
  "domain": ["reject", "icloud", "apple", "google", "proxy", "direct", "private", "gfw", "tld-not-cn"],
  // ipcidr: 按 IP 段匹配的规则（比如国内局域网IP、电报专属IP段等）
  "ipcidr": ["telegramcidr", "cncidr", "lancidr"],
  // classical: 传统经典规则集（包含各类应用软件的混合规则）
  "classical": ["applications"]
};

// 循环生成上述 Loyalsoldier 规则的下载链接
for (const [behavior, names] of Object.entries(lsRules)) {
  names.forEach(name => {
    ruleProviders[name] = {
      ...ruleProviderCommon,
      "behavior": behavior, // 告诉软件这是域名匹配、IP匹配还是经典匹配
      "url": `https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/${name}.txt`, // 具体的下载地址
      "path": `./ruleset/loyalsoldier/${name}.yaml` // 下载后保存在本地的路径
    };
  });
}

// ==========================================
// 3. 全自动下载分流名单 (xiaolin-007 特定应用规则)
// 作用：获取 YouTube、Netflix、TikTok 等特定 App 的最新域名/IP名单
// ==========================================
const xlClassical = ["YouTube", "Netflix", "BilibiliHMT", "AI", "TikTok"];
xlClassical.forEach(name => {
  ruleProviders[name] = {
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": `https://fastly.jsdelivr.net/gh/xiaolin-007/clash@main/rule/${name}.txt`,
    "path": `./ruleset/xiaolin-007/${name}.yaml`
  };
});

// ==========================================
// 4. 核心分流规则 (网络流量的“十字路口交警”)
// 作用：当你访问网站时，软件会【从上到下】严格比对。一旦命中，立刻按后面的策略组放行。
// ==========================================
const rules = [
  // --- 区域规则：越南服务相关的域名和关键字分流 ---
  "DOMAIN-SUFFIX,vn,越南服务",             // 精准匹配所有 .vn 结尾的域名，分给“越南服务”组
  "DOMAIN-SUFFIX,zalo.me,越南服务",        // 匹配越南微信 Zalo
  "DOMAIN-KEYWORD,zalo,越南服务",          // 网址中只要包含 zalo 关键字的
  "DOMAIN-SUFFIX,shopee.vn,越南服务",      
  "DOMAIN-SUFFIX,lazada.vn,越南服务",      
  "DOMAIN-SUFFIX,zing.vn,越南服务",        
  "DOMAIN-SUFFIX,vng.com.vn,越南服务",     
  "DOMAIN-SUFFIX,tiktok.com.vn,越南服务",  
  // ------------------------------------------

  // --- 自定义特殊规则 ---
  "DOMAIN-SUFFIX,googleapis.cn,节点选择",       // Google 国内可用服务，强制走代理（节点选择）
  "DOMAIN-SUFFIX,gstatic.com,节点选择",         // Google 静态资源
  "DOMAIN-SUFFIX,xn--ngstr-lra8j.com,节点选择", // Google Play 下载服务
  "DOMAIN-SUFFIX,github.io,节点选择",           // Github Pages
  "DOMAIN-KEYWORD,jspoo,全局直连",              // 包含 jspoo 的直连不代理
  "DOMAIN,v2rayse.com,节点选择",                // 指定具体域名走代理

  // --- 规则集匹配 (配合上面第2、3步下载的名单使用) ---
  "RULE-SET,applications,全局直连",     // 命中本地应用规则的，直连
  "RULE-SET,private,全局直连",          // 命中私有/局域网规则的，直连
  "RULE-SET,reject,广告过滤",           // 命中广告/跟踪器名单的，丢进广告过滤（拦截）
  "RULE-SET,icloud,微软服务",           // 注意：这里原设定将icloud引向了微软服务
  "RULE-SET,apple,苹果服务",
  "RULE-SET,YouTube,YouTube",           // 命中 YouTube 名单的，走 YouTube 策略组
  "RULE-SET,Netflix,节点选择",          // Netflix 走节点选择
  "RULE-SET,BilibiliHMT,哔哩哔哩港澳台",
  "RULE-SET,AI,AI",
  "RULE-SET,TikTok,TikTok",
  "RULE-SET,google,谷歌服务",
  "RULE-SET,proxy,节点选择",            // 命中已知必须翻墙名单的，走节点选择
  "RULE-SET,gfw,节点选择",              // 命中防火墙黑名单的，走节点选择
  "RULE-SET,tld-not-cn,节点选择",       // 非中国顶级域名的，走节点选择
  "RULE-SET,direct,全局直连",           // 明确要求直连的名单
  
  // --- IP级别匹配 (no-resolve 代表不要解析域名，直接匹配IP，提升速度) ---
  "RULE-SET,lancidr,全局直连,no-resolve",      // 局域网 IP 直连
  "RULE-SET,cncidr,全局直连,no-resolve",       // 中国大陆 IP 直连
  "RULE-SET,telegramcidr,电报消息,no-resolve", // 电报官方 IP 走电报策略组

  // --- 兜底及其他规则 ---
  "GEOSITE,CN,全局直连",                // 中国大陆网站兜底直连
  "GEOIP,VN,越南服务,no-resolve",       // 越南IP兜底：如果前面没匹配上，但IP查到在越南，走越南服务
  "GEOIP,LAN,全局直连,no-resolve",      // 局域网IP兜底直连
  "GEOIP,CN,全局直连,no-resolve",       // 中国IP兜底直连
  "MATCH,漏网之鱼"                      // 终极兜底：上面所有条件都没命中的废流量，统统走这里
];

// ==========================================
// 5. 策略组基础模板与通用节点列表
// ==========================================
// groupBaseOption 定义了测速的标准
const groupBaseOption = {
  "interval": 300,                               // 每 300 秒去测速一次
  "timeout": 3000,                               // 超过 3000 毫秒没连上就算超时
  "url": "https://www.google.com/generate_204",  // 测速用的目标网址（通用的谷歌 204 测速）
  "lazy": true,                                  // 懒测试：如果不使用这个策略组，就不去测速省流量
  "max-failed-times": 3,
  "hidden": false
};

// 这是一个菜单选项的“快捷打包”，下面很多策略组下拉菜单里的选项是一模一样的，打包方便调用
const commonProxies = [
  "节点选择", 
  "香港节点", "香港-自动", 
  "台湾节点", "台湾-自动", 
  "新加坡节点", "新加坡-自动", 
  "美国节点", "美国-自动", 
  "越南节点", "越南-自动", 
  "其他节点",
  "全局直连"
];

// ==========================================
// 6. 程序入口 (Clash Verge 会调用这个 main 函数)
// ==========================================
function main(config) {
  // 检查你有没有导入节点
  const proxyCount = config?.proxies?.length ?? 0;
  const proxyProviderCount = typeof config?.["proxy-providers"] === "object" ? Object.keys(config["proxy-providers"]).length : 0;
  
  if (proxyCount === 0 && proxyProviderCount === 0) {
    throw new Error("配置文件中未找到任何代理");
  }

  // 覆写原配置的规则集和分流规则
  config["rule-providers"] = ruleProviders;
  config["rules"] = rules;

  // 定义软件界面上显示的“策略组”（也就是你看到的各种分组方块和下拉菜单）
  config["proxy-groups"] = [
    // --- 核心的手动选择组 (type: "select") ---
    {
      ...groupBaseOption, 
      "name": "节点选择", 
      "type": "select", 
      "include-all": false,
      "proxies": [
        "香港节点", "香港-自动", 
        "台湾节点", "台湾-自动", 
        "新加坡节点", "新加坡-自动", 
        "美国节点", "美国-自动", 
        "越南节点", "越南-自动", 
        "其他节点", 
        "全局直连"
      ], 
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/adjust.svg"
    },
    // --- 各种特定服务的手动选择组 ---
    {
      ...groupBaseOption, "name": "越南服务", "type": "select", "include-all": false,
      "proxies": commonProxies, // 直接调用上面打包好的通用节点列表
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/map.svg"
    },
    {
      ...groupBaseOption, "name": "谷歌服务", "type": "select", "include-all": false,
      "proxies": commonProxies,
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/google.svg"
    },
    {
      ...groupBaseOption, "name": "YouTube", "type": "select", "include-all": false,
      "proxies": commonProxies,
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/youtube.svg"
    },
    {
      ...groupBaseOption, "name": "电报消息", "type": "select", "include-all": false,
      "proxies": commonProxies,
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/telegram.svg"
    },
    {
      ...groupBaseOption, "name": "AI", "type": "select", "include-all": false,
      "proxies": commonProxies,
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/chatgpt.svg"
    },
    {
      ...groupBaseOption, "name": "TikTok", "type": "select", "include-all": false,
      "proxies": commonProxies,
      "icon": "https://fastly.jsdelivr.net/gh/xiaolin-007/clash@main/icon/tiktok.svg"
    },
    {
      ...groupBaseOption, "name": "微软服务", "type": "select", "include-all": false,
      "proxies": commonProxies,
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/microsoft.svg"
    },
    {
      ...groupBaseOption, "name": "苹果服务", "type": "select", "include-all": false,
      "proxies": commonProxies,
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/apple.svg"
    },
    {
      ...groupBaseOption, "name": "哔哩哔哩港澳台", "type": "select", "include-all": false,
      "proxies": ["全局直连", "节点选择", "台湾节点", "香港节点", "台湾-自动", "香港-自动", "其他节点"], 
      "icon": "https://fastly.jsdelivr.net/gh/xiaolin-007/clash@main/icon/bilibili.svg"
    },
    {
      ...groupBaseOption, "name": "漏网之鱼", "type": "select", "include-all": false,
      "proxies": commonProxies,
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/fish.svg"
    },
    
    // --- 拦截与直连规则组 ---
    {
      ...groupBaseOption, "name": "广告过滤", "type": "select",
      "proxies": ["REJECT", "DIRECT"], // REJECT 表示直接拒绝连接（拦截）
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/bug.svg"
    },
    {
      ...groupBaseOption, "name": "全局直连", "type": "select", 
      "proxies": ["DIRECT"], 
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/link.svg"
    },
    {
      ...groupBaseOption, "name": "全局拦截", "type": "select",
      "proxies": ["REJECT", "DIRECT"],
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/block.svg"
    },

    // --- 地区自动归类组 (利用 filter 正则表达式自动抓取节点) ---
    // 只要节点名字里包含 (广港|香港|HK 等) 关键字，就会被自动塞进“香港节点”列表里
    {
      ...groupBaseOption, "name": "香港节点", "type": "select", "include-all": true, 
      "filter": "(?=.*(广港|香港|HK|Hong Kong|🇭🇰|HongKong)).*$"
    },
    {
      ...groupBaseOption, "name": "台湾节点", "type": "select", "include-all": true, 
      "filter": "(?=.*(广台|台湾|台灣|TW|Tai Wan|🇹🇼|🇨🇳|TaiWan|Taiwan)).*$"
    },
    {
      ...groupBaseOption, "name": "新加坡节点", "type": "select", "include-all": true, 
      "filter": "(?=.*(广新|新加坡|SG|坡|狮城|🇸🇬|Singapore)).*$"
    },
    {
      ...groupBaseOption, "name": "美国节点", "type": "select", "include-all": true, 
      "filter": "(?=.*(广美|US|美国|纽约|波特兰|达拉斯|俄勒|凤凰城|费利蒙|洛杉|圣何塞|圣克拉|西雅|芝加|🇺🇸|United States)).*$"
    },
    {
      ...groupBaseOption, "name": "越南节点", "type": "select", "include-all": true, 
      "filter": "(?=.*(越|越南|VN|vn|vietnam|胡|河内)).*$"
    },
    // 其他节点：排除上面所有国家的关键字，剩下的都丢进这里
    {
      ...groupBaseOption, "name": "其他节点", "type": "select", "include-all": true, 
      "filter": "^(?!.*(官网|套餐|流量|异常|剩余|广港|香港|HK|Hong Kong|🇭🇰|HongKong|广台|台湾|台灣|TW|Tai Wan|🇹🇼|🇨🇳|TaiWan|Taiwan|广新|新加坡|SG|坡|狮城|🇸🇬|Singapore|广美|US|美国|纽约|波特兰|达拉斯|俄勒|凤凰城|费利蒙|洛杉|圣何塞|圣克拉|西雅|芝加|🇺🇸|United States|越|越南|VN|vn|vietnam|胡|河内)).*$"
    },

    // --- 自动测速组 (type: "url-test") ---
    // 在对应的国家节点中，每 120 秒自动测速，谁的延迟低就自动连谁
    {
      ...groupBaseOption, "name": "香港-自动", "type": "url-test", "interval": 120, "tolerance": 200, "include-all": true, "hidden": true, 
      "filter": "(?=.*(广港|香港|HK|Hong Kong|🇭🇰|HongKong)).*$"
    },
    {
      ...groupBaseOption, "name": "台湾-自动", "type": "url-test", "interval": 120, "tolerance": 200, "include-all": true, "hidden": true, 
      "filter": "(?=.*(广台|台湾|台灣|TW|Tai Wan|🇹🇼|🇨🇳|TaiWan|Taiwan)).*$"
    },
    {
      ...groupBaseOption, "name": "新加坡-自动", "type": "url-test", "interval": 120, "tolerance": 200, "include-all": true, "hidden": true, 
      "filter": "(?=.*(广新|新加坡|SG|坡|狮城|🇸🇬|Singapore)).*$"
    },
    {
      ...groupBaseOption, "name": "美国-自动", "type": "url-test", "interval": 120, "tolerance": 200, "include-all": true, "hidden": true, 
      "filter": "(?=.*(广美|US|美国|纽约|波特兰|达拉斯|俄勒|凤凰城|费利蒙|洛杉|圣何塞|圣克拉|西雅|芝加|🇺🇸|United States)).*$"
    },
    {
      ...groupBaseOption, "name": "越南-自动", "type": "url-test", "interval": 120, "tolerance": 200, "include-all": true, "hidden": true, 
      "filter": "(?=.*(越|越南|VN|vn|vietnam|胡|河内)).*$"
    }
  ];

  // ==========================================
  // 7. 开启 UDP 支持
  // 作用：打游戏、连语音/视频电话更稳定，强制为所有节点开启 UDP 协议
  // ==========================================
  if (Array.isArray(config["proxies"])) {
    config["proxies"].forEach(proxy => {
      if (proxy) proxy.udp = true;
    });
  }

  return config;
}
