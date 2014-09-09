$(function() {
    $(document).on('blur', 'div.div-nome-mail-row:not(:last) input', function() {
        var divNomeMail = $(this).parents('.div-nome-mail-row');
        var inputs = $(divNomeMail).find('input[type="text"]');
        for (i = inputs.length - 1; i >= 0; i--) {
            if ($(inputs[i]).val() != '')
                return;
        }
        divNomeMail.remove();
    });

    $(document).on('keypress', 'div.form-group-options div.input-group-option:last-child input', function() {
        var divNomeMail = $(this).parents('.div-nome-mail-row');
        var sDivNomeMailHtml = divNomeMail.html();
        var sInputGroupClasses = divNomeMail.attr('class');

        //Pra criar somente 1 input
        if (divNomeMail.next().length >= 1)
            return;

        //Somente 1 é obrigatorio
        var replace = new Array("required=''", 'required=""', "required");
        sDivNomeMailHtml = replaceAll(replace, "", sDivNomeMailHtml);

        divNomeMail.parent().append('<div class="' + sInputGroupClasses + '">' + sDivNomeMailHtml + '</div>');
    });

    $(document).on('click', 'div.form-group-options .input-group-addon-remove', function() {
        var divNomeMail = $(this).parents('.div-nome-mail-row');
        if ($('.div-nome-mail-row').length == 2) {
            $('.div-nome-mail-row :input').prop('required', true);
        }
        divNomeMail.remove();
    });

    $(document).on('click', '#btnFazerLogin', function() {
        //https://mconf.ufrgs.br/secure?return_to=/webconf/telessauders
        var urlLogin = 'https://mconf.ufrgs.br/secure?return_to=/webconf/%%sala%%';
        var sala = $('#conferencia').find(":selected").val(); //ou $('#conferencia').val();
        urlLogin = replaceAll('%%sala%%', sala, urlLogin);
        window.location = urlLogin;
    });

    $('#pais').change(function() {
        $("#estado").attr("disabled", $("#pais option:selected").text() != "Brasil");
        //$("#cidade").attr("disabled", $("#pais").val() != 1);

        $('#cidade').toggle($("#pais option:selected").text() == "Brasil");
        $('#cidadeOpen').toggle($("#pais option:selected").text() != "Brasil");

    }).trigger('change');

    $('#estado').change(function() {
        ddlbCidades = $("#cidade");
        $.ajax({
            type: "POST",
            url: "http://inf.ufrgs.br/~hivalcanaia/teste_cidades.php",
            //contentType: "application/json; charset=utf-8",
            dataType: "jsonp",
            data: "estado=" + $("#estado").val(),
            error: function(result, sts, err) {
                alert("Ocorreu um erro, verifique o console.");
                console.log(result + " :: " + sts + " :: " + err);
            },
            success: function(data) {
                data = jQuery.parseJSON(data);
                ddlbCidades.empty();
                $.each(data, function(i, cidade) {
                    ddlbCidades.append('<option  value="' + cidade.NOME + '"> ' + cidade.NOME + '</option>');
                });
                console.log("Ajax success");
            },
            complete: function(xhr, status) {
                console.log("Ajax completed");
            }
        });
    }).trigger('change');

    function getConferencias() {
        console.log("getConferencias");
        ddlbConferencias = $("#conferencia");
        $.ajax({
            type: "POST",
            url: "http://inf.ufrgs.br/~hivalcanaia/teste_conferencias.php",
            //contentType: "application/json; charset=utf-8",
            dataType: "jsonp",
            data: "max=10",
            error: function(result, sts, err) {
                alert("Ocorreu um erro, verifique o console.");
                console.log(result + " :: " + sts + " :: " + err);
            },
            success: function(data) {
                data = jQuery.parseJSON(data);
                ddlbConferencias.empty();
                $.each(data, function(i, conf) {
                    ddlbConferencias.append('<option  value="' + conf.SALA + '"> ' + conf.NOME + '</option>');
                });
                console.log("Ajax success");
            },
            complete: function(xhr, status) {
                console.log("Ajax completed");
            }
        });
    }

    function replaceAll(find, replace, str) {
        if (Object.prototype.toString.call(find) === '[object Array]') {
            for (i = find.length - 1; i >= 0; i--) {
                console.log(find[i]);
                str = str.replace(new RegExp(find[i], 'g'), replace);
            }
        } else {
            str = str.replace(new RegExp(find, 'g'), replace);
        }
        return str;
    }


    function parseJson(data) {
        console.log("parseJson");
    }

    function sortlist(list) {
        arrTexts = new Array();

        for (i = 0; i < list.length; i++) {
            console.log("Value: " + list.options[i].value + " :: Texto: " + list.options[i].text);
            arrTexts[list.options[i].value] = list.options[i].text;
        }
        arrTexts.sort();

        j = 0;
        for (i in arrTexts) {
            console.log("Value: " + i + " :: Texto: " + arrTexts[i]);
            //list.options[j++].text = arrTexts[i];
            //list.options[j++].value = i;
        }
        console.log("sortlist");
    }

    function sortSelect(selElem) {
        var tmpAry = new Array();
        for (var i = 0; i < selElem.options.length; i++) {
            tmpAry[i] = new Array();
            tmpAry[i][0] = selElem.options[i].text;
            tmpAry[i][1] = selElem.options[i].value;
        }
        tmpAry.sort();

        clearSelect(selElem);

        for (var i = 0; i < tmpAry.length; i++) {
            var op = new Option(tmpAry[i][0], tmpAry[i][1]);
            selElem.options[i] = op;
        }
        return;
    }

    function clearSelect(selElem) {
        while (selElem.options.length > 0) {
            selElem.options[0] = null;
        }
    }

    getConferencias();
    sortSelect($('#pais')[0]);
    $("#pais").find("option:contains('Brasil')").each(function() {
        if ($(this).text() == 'Brasil') {
            $(this).attr("selected", true);
        }
    });
    sortSelect($('#estado')[0]);
    sortSelect($('#cidade')[0]);
    sortSelect($('#profissao')[0]);
    

});