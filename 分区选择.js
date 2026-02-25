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
    "localhost.work.weixin.qq.com"
  ],
  "default-nameserver": ["223.5.5.5","1.2.4.8"],
  "nameserver": foreignNameservers,
  "proxy-server-nameserver": domesticNameservers,
  "direct-nameserver": domesticNameservers,
  "nameserver-policy": {
    "geosite:private,cn": domesticNameservers
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

// 规则配置
const rules = [
  // --- 新增：越南服务相关的域名和关键字分流 ---
  "DOMAIN-SUFFIX,vn,越南服务",             // 匹配所有 .vn 结尾的越南域名
  "DOMAIN-SUFFIX,zalo.me,越南服务",        // 越南微信 Zalo
  "DOMAIN-KEYWORD,zalo,越南服务",          // 包含 zalo 的域名
  "DOMAIN-SUFFIX,shopee.vn,越南服务",      // 越南虾皮
  "DOMAIN-SUFFIX,lazada.vn,越南服务",      // 越南Lazada
  "DOMAIN-SUFFIX,zing.vn,越南服务",        // 越南Zing
  "DOMAIN-SUFFIX,vng.com.vn,越南服务",     // 越南VNG游戏/娱乐
  "DOMAIN-SUFFIX,tiktok.com.vn,越南服务",  // 越南TikTok节点补充
  // ------------------------------------------

  "DOMAIN-SUFFIX,googleapis.cn,节点选择", 
  "DOMAIN-SUFFIX,gstatic.com,节点选择", 
  "DOMAIN-SUFFIX,xn--ngstr-lra8j.com,节点选择", 
  "DOMAIN-SUFFIX,github.io,节点选择", 
  "DOMAIN-KEYWORD,jspoo,全局直连",
  "DOMAIN,v2rayse.com,节点选择",
  "RULE-SET,applications,全局直连",
  "RULE-SET,private,全局直连",
  "RULE-SET,reject,广告过滤",
  "RULE-SET,icloud,微软服务",
  "RULE-SET,apple,苹果服务",
  "RULE-SET,YouTube,YouTube",
  "RULE-SET,Netflix,节点选择",
  "RULE-SET,Spotify,节点选择",
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

  // 越南IP兜底规则（如果上面的域名没匹配到，但是IP在越南，也走越南服务）
  "GEOIP,VN,越南服务,no-resolve",

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

// 在公共策略中加入了“其他节点”
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
      "include-all": false,
      "proxies": [
        "香港节点", "香港-自动", 
        "台湾节点", "台湾-自动", 
        "新加坡节点", "新加坡-自动", 
        "美国节点", "美国-自动", 
        "越南节点", "越南-自动", 
        "其他节点", // 加入节点选择中
        "全局直连"
      ], 
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/adjust.svg"
    },

    // ---> 新增：越南服务 策略组 <---
    {
      ...groupBaseOption, "name": "越南服务", "type": "select", "include-all": false,
      "proxies": commonProxies, // 这里使用了包含所有地区节点的通用列表，方便您自由选择
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/map.svg"
    },
    // ---------------------------------

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

    // --- 手动分地区节点组 ---
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
    {
      // 新增的“其他节点”组，排除了所有已有地区及无效关键字
      ...groupBaseOption, "name": "其他节点", "type": "select", "include-all": true, 
      "filter": "^(?!.*(官网|套餐|流量|异常|剩余|广港|香港|HK|Hong Kong|🇭🇰|HongKong|广台|台湾|台灣|TW|Tai Wan|🇹🇼|🇨🇳|TaiWan|Taiwan|广新|新加坡|SG|坡|狮城|🇸🇬|Singapore|广美|US|美国|纽约|波特兰|达拉斯|俄勒|凤凰城|费利蒙|洛杉|圣何塞|圣克拉|西雅|芝加|🇺🇸|United States|越|越南|VN|vn|vietnam|胡|河内)).*$"
    },

    // --- 自动分组 ---
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

  // 为所有节点开启 UDP
  if (Array.isArray(config["proxies"])) {
    config["proxies"].forEach(proxy => {
      if (proxy) proxy.udp = true;
    });
  }

  return config;
}
