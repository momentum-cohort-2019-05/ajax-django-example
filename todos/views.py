import json

from django.forms.models import model_to_dict
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.views.generic.base import TemplateView

from todos.models import Todo


class IndexView(TemplateView):
    template_name = "index.html"


@csrf_exempt
@require_http_methods(['GET', 'POST'])
def api_todos_list(request):
    if request.method == "POST":
        return api_todos_create(request)

    todos = Todo.objects.all()
    todo_data = [model_to_dict(todo) for todo in todos]
    return JsonResponse({"todos": todo_data})


def api_todos_create(request):
    todo_data = json.loads(request.body)

    # data should be validated first
    todo = Todo(**todo_data)
    todo.save()

    return JsonResponse(model_to_dict(todo), status=201)


@csrf_exempt
@require_http_methods(['PATCH'])
def api_todos_detail(request, pk):
    todo = get_object_or_404(Todo, pk=pk)
    todo_data = json.loads(request.body)

    if 'done' in todo_data:
        todo.done = todo_data['done']

    todo.save()

    return JsonResponse(model_to_dict(todo))
