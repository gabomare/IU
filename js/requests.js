function request(paramAjax, callBack, fnError) {
    $.ajax(paramAjax).done(function (data, ok, statusCode) {
        var datos = {
            data: data,
            ok: ok,
            statusCode: statusCode.status
        }
        callBack(datos);
    }).error(fnError);
}