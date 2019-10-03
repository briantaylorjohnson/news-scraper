

$.getJSON("/fetch_articles", function(data)
{
    var articlesBlockDiv = $("<div>");
    
    for (var i = 0; i < data.length; i++)
    {
        var articleDiv = $("<div>");
        var articleLink = $("<a>");

        articleDiv.attr(
        {
            "article-id": data[i]._id
        });

        articleLink.attr(
        {
            "article-id": data[i]._id,
            "href": data[i].link,
            "target": "_blank"
        });

        articleLink.text(data[i].title);

        articleDiv.append(articleLink);
        articlesBlockDiv.append(articleDiv);
    }

    $("#sports_news").append(articlesBlockDiv);
});