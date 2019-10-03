$.get("/scrape_news", function(news)
{    
    console.log(news);
});

$.getJSON("/fetch_articles", function(data)
{
    for (let i = 0; i < data.length; i++)
    {
        // Creates an article package DOM element for each article in the database
        let articlePackage = $("<div>");
        articlePackage.attr(
        {
            "class": "article-package mt-2 px-2 pb-2 bg-white",
            "article-id": data[i]._id
        });
        
        // Creates an article row DOM element for each article in the database
        let articleRow = $("<div>");
        articleRow.attr(
        {
            "class": "row article"
        });

        // Creates an article column DOM element for each article in the database
        let articleColumn = $("<div>")
        articleColumn.attr(
        {
            "class": "col-md-12"
        });
        articleColumn.append("<a href='" + data[i].link + "' target='_blank'>" + data[i].title + "</a><br /><button class='notes-open-button' id='notes-open-button-" + data[i]._id + "' article-id='" + data[i]._id + "'>[+] Open Notes</button><button class='notes-close-button' id='notes-close-button-" + data[i]._id + "' article-id='" + data[i]._id + "'>[-] Close Notes</button>");

        // Builds the article row with title, link, and open/close notes buttons
        articleRow.append(articleColumn);
        articlePackage.append(articleRow);

        // Creates a container for each article's notes
        let notesContainer = $("<div>");
        notesContainer.attr(
        {
            "class": "notes notes-container pr-3 pl-3",
            "id": "notes-container-" + data[i]._id
        });
        articlePackage.append(notesContainer);

        // Creates a container for each article's notes entry form
        let notesFormContainer = $("<div>");
        notesFormContainer.attr(
        {
            "class": "notes notes-form-container",
            "id": "notes-form-" + data[i]._id
        });
        notesFormContainer.append("<div class='row notes notes-form'><div class='col-md-12'><form><div class='form-group'><small><label for='addArticleNote'>Title:</label></small><textarea class='form-control form-control-sm' id='note-text-title-" + data[i]._id + "' rows='1'></textarea><small><label for='addArticleNote'>Message:</label></small><textarea class='form-control form-control-sm' id='note-text-" + data[i]._id + "' rows='1'></textarea><small id='form-warning' class='form-text text-danger'>Remember that any notes you post are public and viewable by any user of this application.</small></div><button type='submit' class='btn btn-primary btn-sm submit-note' article-id='" + data[i]._id + "'>Submit</button></form></div>");
        articlePackage.append(notesFormContainer);

        $(".main-content-rail").append(articlePackage);
        $("#notes-close-button-" + data[i]._id).hide();
        $("#notes-container-" + data[i]._id).hide();
        $("#notes-form-" + data[i]._id).hide();
    }
});

function fetchNotes(articleId)
{
    $("#notes-container-" + articleId).empty();

    $.get("/fetch_notes/" + articleId, function(notes)
    {    
        console.log(notes);
        for (let i = 0; i < notes.length; i++)
        {
            let noteListingDiv = $("<div>");
            noteListingDiv.attr(
            {
                "class": "row notes note-listing border border-dark mt-2",
                "note-id": notes[i]._id,
                "id": "note-listing-" + notes[i]._id
            });     
            
            let noteTitleDiv = $("<div>");
            noteTitleDiv.attr(
            {
                "class": "col-md-10 notes note-title-div",
                "note-id": notes[i]._id
            });            

            let noteBodyDiv = $("<div>");
            noteBodyDiv.attr(
            {
                "class": "col-md-10 notes notes-text",
                "note-id": notes[i]._id
            });
            noteBodyDiv.append("<span class='note-title'>" + notes[i].title + "</span><br />" + notes[i].body);

            let noteDelButton = $("<div>");
            noteDelButton.attr(
            {
                "class": "col-md-2 notes notes-delete"
            });
            noteDelButton.append("<button class='notes notes-delete-btn' article-id='" + articleId + "' note-id='" + notes[i]._id + "'>Delete</button>");
            
            noteListingDiv.append(noteBodyDiv);
            noteListingDiv.append(noteDelButton);
            $("#notes-container-" + notes[i].article).append(noteListingDiv);
        }
    });
}


// jQuery listenr to track clicks on the open notes button
    $(".main-content-rail").on("click", ".notes-open-button",function(event)
    {
        $(this).hide();
        $("#notes-close-button-" + $(this).attr("article-id")).show();
        $("#notes-container-" + $(this).attr("article-id")).show();
        $("#notes-form-" + $(this).attr("article-id")).show();
        $("#notes-container-" + $(this).attr("article-id")).empty();
        
        fetchNotes($(this).attr("article-id"));
    });

// jQuery listener to track clicks on the close notes button
$(".main-content-rail").on("click", ".notes-close-button", function(event)
{
    $(this).hide();
    $("#notes-container-" + $(this).attr("article-id")).hide();
    $("#notes-form-" + $(this).attr("article-id")).hide();
    $("#notes-open-button-" + $(this).attr("article-id")).show();
});

// jQuery listener to add a new note to an article
$(".main-content-rail").on("click", ".submit-note", function(event)
{
    event.preventDefault();

    articleId = $(this).attr("article-id");
    noteTitle = $("#note-text-title-" + articleId).val();
    noteBody = $("#note-text-" + articleId).val();
    
    $.ajax(
    {
        method: "POST",
        url: "/post_note",
        data:
        {
            "article": articleId,
            "title": noteTitle,
            "body": noteBody
        }
    }).then(function(postNote)
    {
        console.log(postNote);
        $("#note-text-title-" + articleId).val("");
        $("#note-text-" + articleId).val("");

        console.log(articleId);
        fetchNotes(articleId);
    });

});

$(".main-content-rail").on("click", ".notes-delete-btn", function(event)
{
    let articleId = $(this).attr("article-id");
    console.log(articleId);
    $.ajax(
        {
            method: "POST",
            url: "/delete_note/" + $(this).attr("note-id")
        }).then(function(deleteNote)
        {
            console.log(deleteNote);
            fetchNotes(articleId);
        });

});