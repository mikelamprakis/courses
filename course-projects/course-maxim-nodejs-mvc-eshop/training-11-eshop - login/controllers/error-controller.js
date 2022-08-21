exports.get404Page = (req, res, next) =>{
    res.status(404).render('404-view', {
        pageTitle: 'Page Not Found',
        path: 'no-path',
        isAuthenticated: req.session.isLoggedIn
    });
};