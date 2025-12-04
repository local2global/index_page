// 域名数据 - 按根域组织
const domainData = {
    "houzhaohan.vip": {
        name: "houzhaohan.vip",
        description: "个人简历，重定向于www.houzhaohan.vip",
        icon: "fas fa-building",
        url: "https://houzhaohan.vip",
        protocol: "https",
        domains: [
            {
                name: "www.houzhaohan.vip",
                description: "个人简历，展示个人信息和项目经验",
                status: "active",
                url: "https://www.houzhaohan.vip",
                protocol: "https"
            },
            {
                name: "blog.houzhaohan.vip",
                description: "自己开发的个人博客",
                status: "active",
                url: "https://blog.houzhaohan.vip",
                protocol: "https"
            },
            {
                name: "docs.houzhaohan.vip",
                description: "文件存储库，需增加“/filename”路径访问对应文件",
                status: "active",
                url: "https://docs.houzhaohan.vip",
                protocol: "https"
            },
            {
                name: "navigation.houzhaohan.vip",
                description: "所有域名导航",
                status: "active",
                url: "https://navigation.houzhaohan.vip",
                protocol: "https"
            },
            {
                name: "pay.houzhaohan.vip",
                description: "支付页面",
                status: "active",
                url: "https://pay.houzhaohan.vip",
                protocol: "https"
            }
        ]
    },
    "houzhaohan.online": {
        name: "houzhaohan.online",
        description: "个人简历，重定向于www.houzhaohan.online，于2026年6月停止使用",
        icon: "fas fa-user",
        url: "https://houzhaohan.online",
        protocol: "https",
        domains: [
            {
                name: "www.houzhaohan.online",
                description: "个人简历，展示个人信息和项目经验",
                status: "active",
                url: "https://www.houzhaohan.online",
                protocol: "https"
            },
            {
                name: "guestbook.houzhaohan.online",
                description: "自己开发的留言板",
                status: "active",
                url: "https://guestbook.houzhaohan.online",
                protocol: "https"
            },
            {
                name: "file.houzhaohan.online",
                description: "旧版文件存储库，已迁移至docs.houzhaohan.vip",
                status: "inactive",
                url: "http://file.houzhaohan.online",
                protocol: "http"
            }
        ]
    },
    "njau.homes": {
        name: "njau.homes",
        description: "为完成课程作业购买的域名，根域是一个404页面",
        icon: "fas fa-handshake",
        url: "https://njau.homes",
        protocol: "https",
        domains: [
            {
                name: "welcome.njau.homes",
                description: "欢迎页面",
                status: "active",
                url: "https://welcome.njau.homes",
                protocol: "https"
            },
            {
                name: "renew.njau.homes",
                description: "维护页面测试",
                status: "active",
                url: "https://renew.njau.homes",
                protocol: "https"
            },
            {
                name: "map.njau.homes",
                description: "课程作业，南农校园地图，服务器未运行",
                status: "inactive",
                url: "http://map.njau.homes",
                protocol: "http"
            }
        ]
    }
};

// 全局变量
let activeFilter = 'all'; // 当前激活的筛选器

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    renderDomainFilter();
    renderDomains();
    setupSearch();
    updateDomainCount();
});

// 渲染根域筛选器
function renderDomainFilter() {
    const filterContainer = document.getElementById('domainFilter');
    
    // 创建"全部"筛选按钮
    const allButton = document.createElement('button');
    allButton.className = 'filter-btn active';
    allButton.id = 'filter-all';
    allButton.textContent = '全部';
    allButton.addEventListener('click', () => {
        setActiveFilter('all');
        renderDomains();
    });
    filterContainer.appendChild(allButton);
    
    // 为每个根域创建筛选按钮
    Object.keys(domainData).forEach(rootDomain => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.id = `filter-${rootDomain.replace(/\./g, '-')}`;
        button.textContent = rootDomain;
        button.addEventListener('click', () => {
            setActiveFilter(rootDomain);
            renderDomains();
        });
        filterContainer.appendChild(button);
    });
}

// 设置激活的筛选器
function setActiveFilter(filter) {
    activeFilter = filter;
    
    // 更新按钮状态
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.getElementById(`filter-${filter.replace(/\./g, '-')}`) || 
                     document.getElementById('filter-all');
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// 渲染域名容器
function renderDomains(filterText = '') {
    const mainContent = document.getElementById('mainContent');
    
    // 清空容器
    mainContent.innerHTML = '';
    
    // 获取要渲染的根域
    let rootDomainsToRender = [];
    
    if (activeFilter === 'all') {
        rootDomainsToRender = Object.keys(domainData);
    } else if (domainData[activeFilter]) {
        rootDomainsToRender = [activeFilter];
    }
    
    // 渲染每个根域容器
    rootDomainsToRender.forEach(rootDomain => {
        const rootDomainData = domainData[rootDomain];
        
        // 过滤域名
        const filteredDomains = filterDomains(rootDomainData.domains, filterText);
        
        // 如果没有匹配的域名且搜索框有内容，则跳过该根域
        if (filterText && filteredDomains.length === 0) {
            return;
        }
        
        // 创建根域容器
        const section = document.createElement('section');
        section.className = 'domain-section';
        section.id = `section-${rootDomain.replace(/\./g, '-')}`;
        
        // 计算活跃域名数量
        const activeCount = filteredDomains.filter(d => d.status === 'active').length;
        
        // 创建可点击的根域标题
        const rootDomainTitle = `
            <a href="${rootDomainData.url}" class="root-domain-link" target="_blank" rel="noopener noreferrer" title="点击访问 ${rootDomainData.name}">
                ${rootDomainData.name}
                <i class="fas fa-external-link-alt root-domain-external-link"></i>
            </a>
        `;
        
        section.innerHTML = `
            <div class="section-header">
                <div class="section-header-left">
                    <div class="section-icon">
                        <i class="${rootDomainData.icon}"></i>
                    </div>
                    <div>
                        <h2 class="section-title">${rootDomainTitle}</h2>
                        <p style="color: #6c757d; margin-top: 5px;">${rootDomainData.description}</p>
                    </div>
                </div>
                <div class="domain-count">
                    ${filteredDomains.length} 个子域 (${activeCount} 个运行中)
                </div>
            </div>
            <div class="domain-list" id="domain-list-${rootDomain.replace(/\./g, '-')}">
                <!-- 域名卡片将通过JavaScript动态生成 -->
            </div>
        `;
        
        mainContent.appendChild(section);
        
        // 渲染该根域下的域名卡片
        const domainList = section.querySelector(`#domain-list-${rootDomain.replace(/\./g, '-')}`);
        
        if (filteredDomains.length > 0) {
            filteredDomains.forEach(domain => {
                domainList.appendChild(createDomainCard(domain));
            });
        } else {
            domainList.appendChild(createEmptyState("该根域下暂无域名"));
        }
    });
    
    // 如果没有渲染任何根域容器（搜索无结果）
    if (mainContent.children.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.style.marginTop = '40px';
        emptyState.innerHTML = `
            <i class="fas fa-search"></i>
            <h3>未找到匹配的域名</h3>
            <p>尝试使用其他关键词搜索，或选择其他根域筛选</p>
        `;
        mainContent.appendChild(emptyState);
    }
    
    // 更新域名计数
    updateDomainCount();
}

// 过滤域名
function filterDomains(domains, filterText) {
    if (!filterText) return domains;
    
    const searchTerm = filterText.toLowerCase();
    return domains.filter(domain => 
        domain.name.toLowerCase().includes(searchTerm) || 
        domain.description.toLowerCase().includes(searchTerm)
    );
}

// 创建域名卡片
function createDomainCard(domain) {
    // 创建链接元素
    const link = document.createElement('a');
    link.className = 'domain-card';
    link.href = domain.url;
    link.target = '_blank'; // 在新标签页打开
    link.rel = 'noopener noreferrer';
    link.title = `点击访问 ${domain.name}`;
    
    const iconClass = getIconClass(domain.name);
    
    link.innerHTML = `
        <div class="domain-name">
            <i class="${iconClass}"></i>
            ${domain.name}
            <i class="fas fa-external-link-alt external-link"></i>
        </div>
        <p class="domain-description">${domain.description}</p>
        <div class="domain-info-row">
            <span class="domain-status status-${domain.status}">
                ${domain.status === 'active' ? '运行中' : '已停用'}
            </span>
            <span class="protocol-badge ${domain.protocol === 'https' ? 'https-badge' : 'http-badge'}">
                ${domain.protocol.toUpperCase()}
            </span>
        </div>
    `;
    
    // 添加点击事件，对于非活跃域名提示
    if (domain.status === 'inactive') {
        link.addEventListener('click', function(e) {
            const userConfirmed = confirm(`此域名 (${domain.name}) 标记为"已停用"，可能无法正常访问。\n\n确定要继续访问吗？`);
            if (!userConfirmed) {
                e.preventDefault();
            }
        });
    }
    
    return link;
}

// 根据域名获取图标类名
function getIconClass(domainName) {
    if (domainName.includes('api.')) return 'fas fa-code';
    if (domainName.includes('mail.')) return 'fas fa-envelope';
    if (domainName.includes('admin.')) return 'fas fa-cog';
    if (domainName.includes('dev.') || domainName.includes('beta.') || domainName.includes('staging.')) return 'fas fa-flask';
    if (domainName.includes('analytics.')) return 'fas fa-chart-bar';
    if (domainName.includes('shop.')) return 'fas fa-shopping-cart';
    if (domainName.includes('blog.')) return 'fas fa-blog';
    if (domainName.includes('docs.')) return 'fas fa-book';
    if (domainName.includes('donate.')) return 'fas fa-donate';
    if (domainName.includes('volunteer.')) return 'fas fa-hands-helping';
    if (domainName.includes('app.')) return 'fas fa-mobile-alt';
    if (domainName.includes('lab.')) return 'fas fa-vial';
    return 'fas fa-link';
}

// 创建空状态提示
function createEmptyState(message) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = `
        <i class="fas fa-folder-open"></i>
        <h3>${message}</h3>
    `;
    return emptyState;
}

// 设置搜索功能
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', function() {
        renderDomains(this.value);
    });
}

// 更新域名计数
function updateDomainCount() {
    // 计算总域名数和活跃域名数
    let totalCount = 0;
    let activeCount = 0;
    
    Object.values(domainData).forEach(rootDomainData => {
        totalCount += rootDomainData.domains.length;
        rootDomainData.domains.forEach(domain => {
            if (domain.status === 'active') activeCount++;
        });
    });
    
    document.getElementById('domainCount').textContent = totalCount;
    document.getElementById('activeCount').textContent = activeCount;

}

