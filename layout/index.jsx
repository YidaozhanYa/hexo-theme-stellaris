const {Fragment} = require('react');
const NavBarListPost = require('./components/main/navbar/list_post.jsx');
const NavBarListWiki = require('./components/main/navbar/list_wiki.jsx');
const PostCard = require('./components/main/post_list/post_card.jsx');
const WikiCard = require('./components/main/post_list/wiki_card.jsx');

const LayoutPostCard = (props) => {
    const {post, url_for} = props;
    let className;
    if (post.cover !== undefined && post.poster !== undefined) {
        className = 'post-card post photo reveal';
    } else {
        className = 'post-card post reveal';
    }
    return (
        <a className={className} href={url_for(post.link || post.path)} key={post.path}>
            <PostCard post={post} {...props}/>
        </a>
    )
}
const LayoutWikiCard = (props) => {
    const {proj, url_for} = props;
    let className;
    if (proj.cover !== undefined && proj.poster !== undefined) {
        className = 'post-card wiki photo reveal';
    } else {
        className = 'post-card wiki reveal';
    }
    return (
        <a className={className} href={url_for(proj.link || proj.path)} key={proj.path}>
            <WikiCard proj={proj} {...props}/>
        </a>
    )
}

const LayoutPosts = (props) => {
    const {config, is_home, page, site} = props;
    return (
        <div className="post-list post">
            {(() => {
                const post_cards = [];
                if (is_home()) {
                    if (page.current === 1) {
                        // Pinned posts
                        const pinned = site.posts.filter((post) => post.pin !== undefined).sort(
                            (config.index_generator && config.index_generator.order_by) || '-date'
                        );
                        pinned.forEach((post) => {
                            post_cards.push(<LayoutPostCard post={post} {...props}/>);
                        })
                        // Normal posts
                        page.posts.forEach((post) => {
                            if (post.pin === undefined) {
                                post_cards.push(<LayoutPostCard post={post} {...props}/>);
                            }
                        })
                    } else {
                        page.posts.forEach((post) => {
                            if (post.pin === undefined) {
                                post_cards.push(<LayoutPostCard post={post} {...props}/>);
                            }
                        })
                    }
                }
                return post_cards;
            })()}
        </div>
    )
}

const LayoutWikis = (props) => {
    const {page, theme} = props;
    const wikis = [];
    const elements = [];
    const projects = theme.wiki.projects;
    for (let proj_name of Object.keys(projects)) {
        let proj = projects[proj_name];
        if (proj.index === false || proj.pages === undefined || proj.pages.length === 0) {
            continue;
        }
        if (page.filter === false) {
            // all wikis
            elements.push(
                <div className="post-list wiki" key={proj_name}>
                    <LayoutWikiCard proj={proj.homepage} {...props}/>
                </div>
            )
        } else if (proj.tags && proj.tags.includes(page.tagName) === true) {
            // filtered wikis
            elements.push(
                <div className="post-list wiki filter" key={proj_name}>
                    <LayoutWikiCard proj={proj.homepage} {...props}/>
                </div>
            )
        }
    }
    return elements;
}

module.exports = function Index(props) {
    const {page} = props;

    if (page.menu_id === undefined) {
        if (page.layout === 'wiki_index' && page.wiki) {
            page.menu_id = 'wiki';
        } else {
            page.menu_id = 'post';
        }
    }

    if (page.title && page.wiki) {
        page.robots = 'noindex,follow';
    }

    if (page.menu_id === 'post') {
        return (
            <Fragment>
                <NavBarListPost {...props}/>
                <LayoutPosts {...props}/>
            </Fragment>
        );
    } else if (page.menu_id === 'wiki') {
        return (
            <Fragment>
                <NavBarListWiki {...props}/>
                <LayoutWikis {...props}/>
            </Fragment>
        );
    }
}