class Header extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <header class="header">
                <div class="header-container">
                    <a href="/" class="logo">LiberPDF</a>
                    <nav>
                        <ul class="nav-menu">
                            <li class="nav-item"><a href="/">首页</a></li>
                            <li class="nav-item"><a href="/books">分类</a></li>
                            <li class="nav-item"><a href="/about">关于</a></li>
                        </ul>
                    </nav>
                </div>
            </header>
        `;
    }
}

customElements.define('site-header', Header);