const {Fragment} = require('react');
const ReadNext = props => {
    const {page, config, theme, url_for, date, __} = props;
    let prev, next;
    let title_prev = __('meta.prev');
    let title_next = __('meta.next');
    if (page.layout === 'post') {
        prev = page.prev;
        next = page.next;
        title_prev = __('meta.newer');
        title_next = __('meta.older');
    } else if (page.layout === 'wiki' && page.wiki && page.wiki.length > 0) {
        let proj = theme.wiki.projects[page.wiki];
        if (proj) {
            const current = page.order || 0;
            proj.pages.forEach((p, i) => {
                if (p.order < current) {
                    if (prev === undefined || p.order > prev.order) {
                        prev = p;
                    }
                } else if (p.order > current) {
                    if (next === undefined || p.order < next.order) {
                        next = p;
                    }
                }
            });
        }
    }

    if (prev || next) {
        return (
            <div className="related-wrap reveal" id="read-next">
                <section className="body">
                    <div className="item" id="prev">
                        {prev && (
                            <Fragment>
                                <div className="note">{title_prev}</div>
                                <a href={url_for(prev.path)}>
                                    {prev.title || prev.seo_title || prev.wiki || date(prev.date, config.date_format)}
                                </a>
                            </Fragment>
                        )}
                    </div>
                    <div className="item" id="next">
                        {next && (
                            <Fragment>
                                <div className="note">{title_next}</div>
                                <a href={url_for(next.path)}>
                                    {next.title || next.seo_title || next.wiki || date(next.date, config.date_format)}
                                </a>
                            </Fragment>
                        )}
                    </div>
                </section>
            </div>
        )
    }
}

module.exports = ReadNext;