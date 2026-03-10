// ===================================================
// 1. 规则集提供者 (Rule Providers) 静态配置
// ===================================================
const ruleProviders = {
  // --- Loyalsoldier 基础规则 (Domain 域名匹配) ---
  "reject": { "type": "http", "format": "yaml", "interval": 21600, "behavior": "domain", "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/reject.txt", "path": "./ruleset/loyalsoldier/reject.yaml" },
  "icloud": { "type": "http", "format": "yaml", "interval": 21600, "behavior": "domain", "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/icloud.txt", "path": "./ruleset/loyalsoldier/icloud.yaml" },
  "apple": { "type": "http", "format": "yaml", "interval": 21600, "behavior": "domain", "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/apple.txt", "path": "./ruleset/loyalsoldier/apple.yaml" },
  "google": { "type": "http", "format": "yaml", "interval": 21600, "behavior": "domain", "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/google.txt", "path": "./ruleset/loyalsoldier/google.yaml" },
  "proxy": { "type": "http", "format": "yaml", "interval": 21600, "behavior": "domain", "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/proxy.txt", "path": "./ruleset/loyalsoldier/proxy.yaml" },
  "direct": { "type": "http", "format": "yaml", "interval": 21600, "behavior": "domain", "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/direct.txt", "path": "./ruleset/loyalsoldier/direct.yaml" },
  "private": { "type": "http", "format": "yaml", "interval": 21600, "behavior": "domain", "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/private.txt", "path": "./ruleset/loyalsoldier/private.yaml" },
  "gfw": { "type": "http", "format": "yaml", "interval": 21600, "behavior": "domain", "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/gfw.txt", "path": "./ruleset/loyalsoldier/gfw.yaml" },
  "tld-not-cn": { "type": "http", "format": "yaml", "interval": 21600, "behavior": "domain", "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/tld-not-cn.txt", "path": "./ruleset/loyalsoldier/tld-not-cn.yaml" },
  
  // --- Loyalsoldier 基础规则 (IPCIDR IP段匹配) ---
  "telegramcidr": { "type": "http", "format": "yaml", "interval": 21600, "behavior": "ipcidr", "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/telegramcidr.txt", "path": "./ruleset/loyalsoldier/telegramcidr.yaml" },
  "cncidr": { "type": "http", "format": "yaml", "interval": 21600, "behavior": "ipcidr", "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/cncidr.txt", "path": "./ruleset/loyalsoldier/cncidr.yaml" },
  "lancidr": { "type": "http", "format": "yaml", "interval": 21600, "behavior": "ipcidr", "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/lancidr.txt", "path": "./ruleset/loyalsoldier/lancidr.yaml" },
  
  // --- Loyalsoldier 基础规则 (Classical 传统匹配) ---
  "applications": { "type": "http", "format": "yaml", "interval": 21600, "behavior": "classical", "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/applications.txt", "path": "./ruleset/loyalsoldier/applications.yaml" },
  
  // --- xiaolin-007 特定应用规则 (Classical) ---
  "YouTube": { "type": "http", "format": "yaml", "interval": 21600, "behavior": "classical", "url": "https://fastly.jsdelivr.net/gh/xiaolin-007/clash@main/rule/YouTube.txt", "path": "./ruleset/xiaolin-007/YouTube.yaml" },
  "Netflix": { "type": "http", "format": "yaml", "interval": 21600, "behavior": "classical", "url": "https://fastly.jsdelivr.net/gh/xiaolin-007/clash@main/rule/Netflix.txt", "path": "./ruleset/xiaolin-007/Netflix.yaml" },
  "BilibiliHMT": { "type": "http", "format": "yaml", "interval": 21600, "behavior": "classical", "url": "https://fastly.jsdelivr.net/gh/xiaolin-007/clash@main/rule/BilibiliHMT.txt", "path": "./ruleset/xiaolin-007/BilibiliHMT.yaml" },
  "AI": { "type": "http", "format": "yaml", "interval": 21600, "behavior": "classical", "url": "https://fastly.jsdelivr.net/gh/xiaolin-007/clash@main/rule/AI.txt", "path": "./ruleset/xiaolin-007/AI.yaml" },
  "TikTok": { "type": "http", "format": "yaml", "interval": 21600, "behavior": "classical", "url": "https://fastly.jsdelivr.net/gh/xiaolin-007/clash@main/rule/TikTok.txt", "path": "./ruleset/xiaolin-007/TikTok.yaml" }
};

// ===================================================
// 2. 核心分流规则 (Rules) - 严格遵循最优排序
// ===================================================
const rules = [
  // --- 1. 局域网与私有网络 (最高优先级) ---
  "RULE-SET,applications,全局直连",
  "RULE-SET,private,全局直连",
  "RULE-SET,lancidr,全局直连,no-resolve",
  
  // --- 2. 广告拦截 ---
  "RULE-SET,reject,广告过滤",
  
  // --- 3. 用户自定义与精准域名 ---
  "DOMAIN-SUFFIX,vn,🇻🇳 越南服务",
  "DOMAIN-SUFFIX,zalo.me,🇻🇳 越南服务",
  "DOMAIN-KEYWORD,zalo,🇻🇳 越南服务",
  "DOMAIN-SUFFIX,shopee.vn,🇻🇳 越南服务",
  "DOMAIN-SUFFIX,lazada.vn,🇻🇳 越南服务",
  "DOMAIN-SUFFIX,zing.vn,🇻🇳 越南服务",
  "DOMAIN-SUFFIX,vng.com.vn,🇻🇳 越南服务",
  "DOMAIN-SUFFIX,tiktok.com.vn,🇻🇳 越南服务",
  "DOMAIN-KEYWORD,jspoo,🔗 全局直连",
  "DOMAIN,v2rayse.com,🚀 节点选择",
  "DOMAIN-SUFFIX,googleapis.cn,🚀 节点选择",
  "DOMAIN-SUFFIX,gstatic.com,🚀 节点选择",
  "DOMAIN-SUFFIX,xn--ngstr-lra8j.com,🚀 节点选择",
  "DOMAIN-SUFFIX,github.io,🚀 节点选择",
  
  // --- 4. 特定应用服务 ---
  "RULE-SET,icloud,🍎 苹果服务",
  "RULE-SET,apple,🍎 苹果服务",
  "RULE-SET,YouTube,▶️ YouTube",
  "RULE-SET,Netflix,🚀 节点选择",
  "RULE-SET,BilibiliHMT,📺 哔哩哔哩港澳台",
  "RULE-SET,AI,🤖 AI",
  "RULE-SET,TikTok,🎵 TikTok",
  "RULE-SET,google,🔍 谷歌服务",
  "RULE-SET,telegramcidr,📲 电报消息,no-resolve",
  
  // --- 5. 广泛的海外代理名单 ---
  "RULE-SET,proxy,🚀 节点选择",
  "RULE-SET,gfw,🚀 节点选择",
  "RULE-SET,tld-not-cn,🚀 节点选择",
  
  // --- 6. 广泛的国内直连名单 ---
  "RULE-SET,direct,🔗 全局直连",
  "GEOSITE,CN,🔗 全局直连",
  "RULE-SET,cncidr,🔗 全局直连,no-resolve",
  
  // --- 7. IP 级别兜底 ---
  "GEOIP,VN,🇻🇳 越南服务,no-resolve",
  "GEOIP,LAN,🔗 全局直连,no-resolve",
  "GEOIP,CN,🔗 全局直连,no-resolve",
  
  // --- 8. 终极兜底 ---
  "MATCH,🐟 漏网之鱼"
];

// ===================================================
// 3. 策略组基础模板与通用节点列表
// ===================================================
const groupBaseOption = {
  "interval": 300,
  "timeout": 3000,
  "url": "https://www.google.com/generate_204",
  "lazy": true,
  "max-failed-times": 3
};

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

// ===================================================
// 4. 程序入口 (Clash Verge 会调用这个 main 函数)
// ===================================================
function main(config) {
  // 注入规则集和规则
  config["rule-providers"] = ruleProviders;
  config["rules"] = rules;

  // 定义策略组
  config["proxy-groups"] = [
    {
      ...groupBaseOption, 
      "name": "🚀 节点选择", 
      "type": "select", 
      "proxies": ["香港节点", "香港-自动", "台湾节点", "台湾-自动", "新加坡节点", "新加坡-自动", "美国节点", "美国-自动", "越南节点", "越南-自动", "其他节点", "全局直连"], 
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/adjust.svg"
    },
    { ...groupBaseOption, "name": "🇻🇳 越南服务", "type": "select", "proxies": commonProxies, "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/map.svg" },
    { ...groupBaseOption, "name": "🔍 谷歌服务", "type": "select", "proxies": commonProxies, "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/google.svg" },
    { ...groupBaseOption, "name": "▶️ YouTube", "type": "select", "proxies": commonProxies, "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/youtube.svg" },
    { ...groupBaseOption, "name": "📲 电报消息", "type": "select", "proxies": commonProxies, "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/telegram.svg" },
    { ...groupBaseOption, "name": "🤖 AI", "type": "select", "proxies": commonProxies, "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/chatgpt.svg" },
    { ...groupBaseOption, "name": "🎵 TikTok", "type": "select", "proxies": commonProxies, "icon": "https://fastly.jsdelivr.net/gh/xiaolin-007/clash@main/icon/tiktok.svg" },
    { ...groupBaseOption, "name": "Ⓜ️ 微软服务", "type": "select", "proxies": commonProxies, "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/microsoft.svg" },
    { ...groupBaseOption, "name": "🍎 苹果服务", "type": "select", "proxies": commonProxies, "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/apple.svg" },
    { 
      ...groupBaseOption, 
      "name": "📺 哔哩哔哩港澳台", 
      "type": "select", 
      "proxies": ["全局直连", "节点选择", "台湾节点", "香港节点", "台湾-自动", "香港-自动", "其他节点"], 
      "icon": "https://fastly.jsdelivr.net/gh/xiaolin-007/clash@main/icon/bilibili.svg" 
    },
    { ...groupBaseOption, "name": "🐟 漏网之鱼", "type": "select", "proxies": commonProxies, "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/fish.svg" },
    {
      ...groupBaseOption, "name": "🛡️ 广告过滤", "type": "select", "proxies": ["REJECT", "DIRECT"], "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/bug.svg"
    },
    {
      ...groupBaseOption, "name": "🔗 全局直连", "type": "select", "proxies": ["DIRECT"], "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/link.svg"
    },
    {
      ...groupBaseOption, "name": "🛑 全局拦截", "type": "select", "proxies": ["REJECT", "DIRECT"], "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/block.svg"
    },

    // --- 地区自动分组 (正则匹配节点) ---
    { "name": "香港节点", "type": "select", "include-all": true, "filter": "(?=.*(广港|香港|HK|Hong Kong|🇭🇰|HongKong)).*$" },
    { "name": "台湾节点", "type": "select", "include-all": true, "filter": "(?=.*(广台|台湾|台灣|TW|Tai Wan|🇹🇼|🇨🇳|TaiWan|Taiwan)).*$" },
    { "name": "新加坡节点", "type": "select", "include-all": true, "filter": "(?=.*(广新|新加坡|SG|坡|狮城|🇸🇬|Singapore)).*$" },
    { "name": "美国节点", "type": "select", "include-all": true, "filter": "(?=.*(广美|US|美国|纽约|波特兰|达拉斯|俄勒|凤凰城|费利蒙|洛杉|圣何塞|圣克拉|西雅|芝加|🇺🇸|United States)).*$" },
    { "name": "越南节点", "type": "select", "include-all": true, "filter": "(?=.*(越|越南|VN|vn|vietnam|胡|河内)).*$" },
    { "name": "其他节点", "type": "select", "include-all": true, "filter": "^(?!.*(官网|套餐|流量|异常|剩余|广港|香港|HK|Hong Kong|🇭🇰|HongKong|广台|台湾|台灣|TW|Tai Wan|🇹🇼|🇨🇳|TaiWan|Taiwan|广新|新加坡|SG|坡|狮城|🇸🇬|Singapore|广美|US|美国|纽约|波特兰|达拉斯|俄勒|凤凰城|费利蒙|洛杉|圣何塞|圣克拉|西雅|芝加|🇺🇸|United States|越|越南|VN|vn|vietnam|胡|河内)).*$" },
    
    // --- 自动测速优选节点组 ---
    { "name": "香港-自动", "type": "url-test", "interval": 120, "tolerance": 200, "hidden": true, "include-all": true, "filter": "(?=.*(广港|香港|HK|Hong Kong|🇭🇰|HongKong)).*$" },
    { "name": "台湾-自动", "type": "url-test", "interval": 120, "tolerance": 200, "hidden": true, "include-all": true, "filter": "(?=.*(广台|台湾|台灣|TW|Tai Wan|🇹🇼|🇨🇳|TaiWan|Taiwan)).*$" },
    { "name": "新加坡-自动", "type": "url-test", "interval": 120, "tolerance": 200, "hidden": true, "include-all": true, "filter": "(?=.*(广新|新加坡|SG|坡|狮城|🇸🇬|Singapore)).*$" },
    { "name": "美国-自动", "type": "url-test", "interval": 120, "tolerance": 200, "hidden": true, "include-all": true, "filter": "(?=.*(广美|US|美国|纽约|波特兰|达拉斯|俄勒|凤凰城|费利蒙|洛杉|圣何塞|圣克拉|西雅|芝加|🇺🇸|United States)).*$" },
    { "name": "越南-自动", "type": "url-test", "interval": 120, "tolerance": 200, "hidden": true, "include-all": true, "filter": "(?=.*(越|越南|VN|vn|vietnam|胡|河内)).*$" }
  ];

  // 强制开启 UDP (提升游戏、语音通话连通率)
  if (Array.isArray(config["proxies"])) {
    config["proxies"].forEach(proxy => {
      if (proxy) proxy.udp = true;
    });
  }

  return config;
}
