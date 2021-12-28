window.addEventListener('message', (e) => {
    const data = e.data;
    if (data.type === 'getCov') {
        const cov = {coverage:window.__coverage__,canyon:window.__canyon__} || {}
        e.source.postMessage({type:'giveCov',payload: cov},"*");
    }
});
