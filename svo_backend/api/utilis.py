def log_action(request, action, description=""):
    from .models import LogAction

    ip = None
    if request:
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            ip = x_forwarded_for.split(",")[0]
        else:
            ip = request.META.get("REMOTE_ADDR")

    LogAction.objects.create(
        utilisateur=request.user if request.user.is_authenticated else None,
        action=action,
        description=description,
        ip_address=ip,
    )
