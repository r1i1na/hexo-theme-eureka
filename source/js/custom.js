document.addEventListener('DOMContentLoaded', function () {
    document.body.style.cursor = 'url("/cur/nor.cur"), auto';

    document.querySelectorAll('a, button, .clickable').forEach(element => {
        element.addEventListener('mouseenter', function () {
            document.body.style.cursor = 'url("/cur/link_select.cur"), pointer';
        });
        element.addEventListener('mouseleave', function () {
            document.body.style.cursor = 'url("/cur/nor.cur"), auto';
        });
    });

    document.querySelectorAll('textarea, input, select').forEach(element => {
        element.addEventListener('mouseenter', function () {
            document.body.style.cursor = 'url("/cur/text_select.cur"), text';
        });
        element.addEventListener('mouseleave', function () {
            document.body.style.cursor = 'url("/cur/nor.cur"), auto';
        });
    });
});