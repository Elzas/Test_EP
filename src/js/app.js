function ajax_get(url, page, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            try {
                var data = JSON.parse(xmlhttp.responseText);
            } catch(err) {
                console.log(err.message);
                return;
            }
            callback(data);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}



var showPages = 3,
    totalPages = 10,
    render = document.getElementById("render"),
    city = document.getElementById("city");

function Paginate(p) {

    p = parseInt(p);

    if (totalPages < showPages)
        showPages = totalPages;
    if (p > totalPages) p = totalPages;
    if (p < 1) p = 1;

    var hf2 = parseInt(Math.floor(showPages / 2));
    var hf1 = hf2;

    if (showPages % 2 === 0)
        hf1--;


    var from = parseInt(p - hf1);
    var to = parseInt(p + hf2);

    while (from < 1) {
        from++;
    }
    while (to > totalPages) {
        to--;
    }
    var pivot = (p - from);

    while (pivot < hf2 && to < totalPages) {
        to++;
        pivot++;
    }

    pivot = (to - p);

    if (showPages % 2 === 0) {
        while (pivot <= hf1 && from > 1) {
            from--;
            pivot++;
        }
    } else {
        while (pivot < hf1 && from > 1) {
            from--;
            pivot++;
        }
    }

    var prev = ((p - 1) < 1) ? 1 : (p - 1),
        next = ((p + 1) >= totalPages) ? totalPages : (p + 1);

    var ul = document.createElement('ul');
    ul.setAttribute("class", "pagination");


    var liPrev = document.createElement('li');
    liPrev.setAttribute("data-page", prev);
    if (p === prev)
        liPrev.setAttribute("class", "page prev disable");
    else {
        liPrev.setAttribute("class", "page prev");
        clickEventGenerate(liPrev);
    }
    ul.appendChild(liPrev);

    for (var i = from; i <= to; i++) {
        var _page = document.createElement('li');
        _page.innerHTML = i;
        _page.setAttribute("data-page", i);
        if (i === p)
            _page.setAttribute("class", 'page active');
        else {
            _page.setAttribute("class", 'page');
            clickEventGenerate(_page);
        }
        ul.appendChild(_page);
    }


    var liNext = document.createElement('li');
    liNext.setAttribute("data-page", next);
    if (p === next)
        liNext.setAttribute("class", "page next disable");
    else {
        liNext.setAttribute("class", "page next");
        clickEventGenerate(liNext);
    }
    ul.appendChild(liNext);

    render.innerHTML = "";
    render.appendChild(ul)

}

function clickEventGenerate(e) {

    e.addEventListener("click", function (e) {

        var page = e.target.getAttribute("data-page");

        Paginate(page);

        ajax_get("data/test.json", page, function(data) {
            document.getElementById("city").innerHTML = "<span>" + data[page - 1]["city"] + "</span>";
        });
    });
}

document.addEventListener("DOMContentLoaded", function () {

    Paginate(5);

    ajax_get("data/test.json", 4, function(data) {
        document.getElementById("city").innerHTML = "<span>" + data[4]["city"] + "</span>";
    });

});