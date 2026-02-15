// 国内DNS服务器
const domesticNameservers = [
  "https://223.5.5.5/dns-query", // 阿里DoH
  "https://doh.pub/dns-query"    // 腾讯DoH
];

// 国外DNS服务器
const foreignNameservers = [
  "https://208.67.222.222/dns-query", // OpenDNS
  "https://77.88.8.8/dns-query",      // YandexDNS
  "https://1.1.1.1/dns-query",        // CloudflareDNS
  "https://8.8.4.4/dns-query"         // GoogleDNS  
];

// DNS配置
const dnsConfig = {
  "enable": true,
  "listen": "0.0.0.0:1053",
  "ipv6": false,
  "prefer-h3": false,
  "respect-rules": true,
  "use-system-hosts": false,
  "cache-algorithm": "arc",
  "enhanced-mode": "fake-ip",
  "fake-ip-range": "198.18.0.1/16",
  "fake-ip-filter": [
    "+.lan",
    "+.local",
    "+.msftconnecttest.com",
    "+.msftncsi.com",
    "localhost.ptlogin2.qq.com",
    "localhost.sec.qq.com",
    "+.in-addr.arpa", 
    "+.ip6.arpa",
    "time.*.com",
    "time.*.gov",
    "pool.ntp.org",
    "localhost.work.weixin.qq.com",
    "+.steamcontent.com",             // 放行 Steam 下载 CDN 的真实 IP
    "client-download.steampowered.com" // 放行 Steam 客户端下载真实 IP
  ],
  "default-nameserver": ["223.5.5.5","1.2.4.8"],
  "nameserver": foreignNameservers,
  "proxy-server-nameserver": domesticNameservers,
  "direct-nameserver": domesticNameservers,
  "nameserver-policy": {
    "geosite:private,cn": domesticNameservers,
    // 强制 Steam 下载域名使用国内 DNS 解析，确保获取国内 CDN（内容分发网络）节点！
    "+.steamcontent.com": domesticNameservers,
    "client-download.steampowered.com": domesticNameservers
  }
};

// 批量生成规则集
const ruleProviderCommon = {
  "type": "http",
  "format": "yaml",
  "interval": 86400
};

const ruleProviders = {};

const lsRules = {
  "domain": ["reject", "icloud", "apple", "google", "proxy", "direct", "private", "gfw", "tld-not-cn"],
  "ipcidr": ["telegramcidr", "cncidr", "lancidr"],
  "classical": ["applications"]
};
for (const [behavior, names] of Object.entries(lsRules)) {
  names.forEach(name => {
    ruleProviders[name] = {
      ...ruleProviderCommon,
      "behavior": behavior,
      "url": `https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/${name}.txt`,
      "path": `./ruleset/loyalsoldier/${name}.yaml`
    };
  });
}

const xlClassical = ["YouTube", "Netflix", "Spotify", "BilibiliHMT", "AI", "TikTok"];
xlClassical.forEach(name => {
  ruleProviders[name] = {
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": `https://fastly.jsdelivr.net/gh/xiaolin-007/clash@main/rule/${name}.txt`,
    "path": `./ruleset/xiaolin-007/${name}.yaml`
  };
});

// 游戏下载（CDN）规则集
ruleProviders["GameDownload"] = {
  ...ruleProviderCommon,
  "behavior": "classical",
  "url": "https://fastly.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Game/GameDownload/GameDownload.yaml",
  "path": "./ruleset/blackmatrix7/gamedownload.yaml"
};

// 常规游戏平台规则集
ruleProviders["Games"] = {
  ...ruleProviderCommon,
  "behavior": "classical",
  "url": "https://fastly.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Game/Game.yaml",
  "path": "./ruleset/blackmatrix7/games.yaml"
};

// 规则配置
const rules = [
  "DOMAIN-SUFFIX,googleapis.cn,节点选择", 
  "DOMAIN-SUFFIX,gstatic.com,节点选择", 
  "DOMAIN-SUFFIX,xn--ngstr-lra8j.com,节点选择", 
  "DOMAIN-SUFFIX,github.io,节点选择", 
  "DOMAIN,v2rayse.com,节点选择", 
  
  // 【核心修复】：必须把游戏规则放在 applications 前面，防止流量被提前拦截！
  "RULE-SET,GameDownload,游戏下载", 
  "RULE-SET,Games,游戏",            
  
  "RULE-SET,applications,全局直连",
  "RULE-SET,private,全局直连",
  "RULE-SET,reject,广告过滤",
  "RULE-SET,icloud,微软服务",
  "RULE-SET,apple,苹果服务",
  "RULE-SET,YouTube,YouTube",
  "RULE-SET,Netflix,Netflix",
  "RULE-SET,Spotify,Spotify",
  "RULE-SET,BilibiliHMT,哔哩哔哩港澳台",
  "RULE-SET,AI,AI",
  "RULE-SET,TikTok,TikTok",
  "RULE-SET,google,谷歌服务",
  "RULE-SET,proxy,节点选择",
  "RULE-SET,gfw,节点选择",
  "RULE-SET,tld-not-cn,节点选择",
  "RULE-SET,direct,全局直连",
  "RULE-SET,lancidr,全局直连,no-resolve",
  "RULE-SET,cncidr,全局直连,no-resolve",
  "RULE-SET,telegramcidr,电报消息,no-resolve",
  "GEOSITE,CN,全局直连",
  "GEOIP,LAN,全局直连,no-resolve",
  "GEOIP,CN,全局直连,no-resolve",
  "MATCH,漏网之鱼"
];

const groupBaseOption = {
  "interval": 300,
  "timeout": 3000,
  "url": "https://www.google.com/generate_204",
  "lazy": true,
  "max-failed-times": 3,
  "hidden": false
};

// 提取的公共节点和正则
const commonProxies = ["节点选择", "美国-自动", "香港-自动", "台湾-自动", "新加坡-自动", "越南-自动", "全局直连"];
const commonFilter = "^(?!.*(官网|套餐|流量|异常|剩余)).*$";

// 程序入口
function main(config) {
  const proxyCount = config?.proxies?.length ?? 0;
  const proxyProviderCount = typeof config?.["proxy-providers"] === "object" ? Object.keys(config["proxy-providers"]).length : 0;
  
  if (proxyCount === 0 && proxyProviderCount === 0) {
    throw new Error("配置文件中未找到任何代理");
  }

  config["dns"] = dnsConfig;
  config["rule-providers"] = ruleProviders;
  config["rules"] = rules;

  config["proxy-groups"] = [
    {
      ...groupBaseOption, 
      "name": "节点选择", 
      "type": "select", 
      "include-all": true, 
      "filter": commonFilter,
      "proxies": ["美国-自动","香港-自动","台湾-自动","新加坡-自动","越南-自动","全局直连"],
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/adjust.svg"
    },
    {
      ...groupBaseOption, 
      "name": "谷歌服务", 
      "type": "select", 
      "include-all": false,
      "proxies": commonProxies,
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/google.svg"
    },
    {
      ...groupBaseOption, 
      "name": "YouTube", 
      "type": "select", 
      "include-all": false,
      "proxies": commonProxies,
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/youtube.svg"
    },
    {
      ...groupBaseOption, 
      "name": "Netflix", 
      "type": "select", 
      "include-all": false,
      "proxies": commonProxies,
      "icon": "https://fastly.jsdelivr.net/gh/xiaolin-007/clash@main/icon/netflix.svg"
    },
    {
      ...groupBaseOption, 
      "name": "电报消息", 
      "type": "select", 
      "include-all": false,
      "proxies": commonProxies,
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/telegram.svg"
    },
    {
      ...groupBaseOption, 
      "name": "AI", 
      "type": "select", 
      "include-all": false,
      "proxies": commonProxies,
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/chatgpt.svg"
    },
    {
      ...groupBaseOption, 
      "name": "TikTok", 
      "type": "select", 
      "include-all": false,
      "proxies": commonProxies,
      "icon": "https://fastly.jsdelivr.net/gh/xiaolin-007/clash@main/icon/tiktok.svg"
    },
    {
      ...groupBaseOption, 
      "name": "游戏", 
      "type": "select", 
      "include-all": false,
      "proxies": commonProxies, 
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/gamepad.svg" 
    },
    {
      ...groupBaseOption, 
      "name": "游戏下载", 
      "type": "select", 
      "include-all": false,
      "proxies": ["全局直连", "节点选择", "香港-自动", "台湾-自动", "美国-自动"], 
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/download.svg" 
    },
    {
      ...groupBaseOption, 
      "name": "微软服务", 
      "type": "select", 
      "include-all": false,
      "proxies": commonProxies,
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/microsoft.svg"
    },
    {
      ...groupBaseOption, 
      "name": "苹果服务", 
      "type": "select", 
      "include-all": false,
      "proxies": commonProxies,
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/apple.svg"
    },
    {
      ...groupBaseOption, 
      "name": "哔哩哔哩港澳台", 
      "type": "select", 
      "include-all": false,
      "proxies": ["全局直连","节点选择","台湾-自动","香港-自动"],
      "icon": "https://fastly.jsdelivr.net/gh/xiaolin-007/clash@main/icon/bilibili.svg"
    },
    {
      ...groupBaseOption, 
      "name": "Spotify", 
      "type": "select", 
      "include-all": false,
      "proxies": commonProxies,
      "icon": "https://fastly.jsdelivr.net/gh/xiaolin-007/clash@main/icon/spotify.svg"
    },
    {
      ...groupBaseOption, "name": "广告过滤", "type": "select",
      "proxies": ["REJECT", "DIRECT"],
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
    {
      ...groupBaseOption, "name": "美国-自动", "type": "url-test", "interval": 120, "tolerance": 200, "include-all": true,
      "filter": "(?=.*(广美|US|美国|纽约|波特兰|达拉斯|俄勒|凤凰城|费利蒙|洛杉|圣何塞|圣克拉|西雅|芝加|🇺🇸|United States)).*$"
    },
    {
      ...groupBaseOption, "name": "香港-自动", "type": "url-test", "interval": 120, "tolerance": 200, "include-all": true,
      "filter": "(?=.*(广港|香港|HK|Hong Kong|🇭🇰|HongKong)).*$"
    },
    {
      ...groupBaseOption, "name": "台湾-自动", "type": "url-test", "interval": 120, "tolerance": 200, "include-all": true,
      "filter": "(?=.*(广台|台湾|台灣|TW|Tai Wan|🇹🇼|🇨🇳|TaiWan|Taiwan)).*$"
    },
    {
      ...groupBaseOption, "name": "越南-自动", "type": "url-test", "interval": 120, "tolerance": 200, "include-all": true,
      "filter": "(?=.*(越|越南|VN|vn|vietnam|胡|河内)).*$"
    },
    {
      ...groupBaseOption, "name": "新加坡-自动", "type": "url-test", "interval": 120, "tolerance": 200, "include-all": true,
      "filter": "(?=.*(广新|新加坡|SG|坡|狮城|🇸🇬|Singapore)).*$"
    },
    {
      ...groupBaseOption, "name": "漏网之鱼", "type": "select", "include-all": true, "filter": commonFilter,
      "proxies": ["节点选择","全局直连"],
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/fish.svg"
    }
  ];

  // 为所有节点开启 UDP
  if (Array.isArray(config["proxies"])) {
    config["proxies"].forEach(proxy => {
      if (proxy) proxy.udp = true;
    });
  }

  return config;
}
