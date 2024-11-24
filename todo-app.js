(function () {
  let listArr = []; // создаём пустой массив
  listName = "";

  //создаём и возвращаем заголовок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement("h2");
    appTitle.innerHTML = title;
    return appTitle;
  }

  // создаём и возвращаем форму для создания дела
  function createTodoItemForm() {
    let form = document.createElement("form");
    let input = document.createElement("input");
    let buttonWrapper = document.createElement("div");
    let button = document.createElement("button");

    form.classList.add("input-group", "mb-3");
    input.classList.add("form-control");
    input.placeholder = "Введите название нового дела";
    buttonWrapper.classList.add("input-group-append");
    button.classList.add("btn", "btn-primary");
    button.textContent = "Добавить дело";
    button.disabled = true;

    buttonWrapper.append(button);
    form.append(input, buttonWrapper);

    input.addEventListener("input", function () {
      if (input.value !== "") {
        button.disabled = false;
      } else {
        button.disabled = true;
      }
    });

    return {
      form,
      input,
      button,
    };
  }

  // создаём и возвращаем список элементов
  function createTodolist() {
    let list = document.createElement("ul");
    list.classList.add("list-group");
    return list;
  }

  function createTodoItem(obj) {
    let item = document.createElement("li");
    // кнопки помещаем в элемент, который красиво покажет их в одной группе
    let buttonGroup = document.createElement("div");
    let doneButton = document.createElement("button");
    let deleteButton = document.createElement("button");

    // устанавливаем стили для элемента списка, а также для размещения кнопок
    //  в его правой части , с помощью flex

    item.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );
    item.textContent = obj.name;
    buttonGroup.classList.add("btn-group", "btn-group-sm");
    doneButton.classList.add("btn", "btn-success");
    doneButton.textContent = "Готово";
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.textContent = "Удалить";

    if (obj.done == true) item.classList.add("list-group-item-success");

    // добовляем обработчики на кнопки
    doneButton.addEventListener("click", function () {
      item.classList.toggle("list-group-item-success");
      console.log(obj.id);
      for (const listItem of listArr) {
        if (listItem.id == obj.id) listItem.done = !listItem.done;
      }

      saveList(listArr, listName);
    });

    deleteButton.addEventListener("click", function () {
      if (confirm("Вы уверены?")) {
        item.remove();
      }

      for (let i = 0; i < listArr.length; i++) {
        if (listArr[i].id == obj.id) listArr.splice(i, 1);
      }

      saveList(listArr, listName);
    });

    // вкладываем кнопки в отдельный элемент, чтобы они объеденились в один блок
    buttonGroup.append(doneButton, deleteButton);
    item.append(buttonGroup);

    // приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
    return {
      item,
      doneButton,
      deleteButton,
    };
  }

  function getNewId(arr) {
    let max = 0;
    for (const item of arr) {
      if (item.id > max) max = item.id;
    }
    return max + 1;
  }

  function saveList(arr, keyName) {
    localStorage.setItem(keyName, JSON.stringify(arr));
  }

  function createTodoApp(
    container,
    title = "Список дел",
    keyName,
    defArr = []
  ) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodolist();

    listName = keyName;
    listArr = defArr;

    container.append(todoAppTitle, todoItemForm.form, todoList);

    let localData = localStorage.getItem(listName);

    if (localData !== null && localData !== "") listArr = JSON.parse(localData);

    for (const itemList of listArr) {
      let todoItem = createTodoItem(itemList);
      todoList.append(todoItem.item);
    }

    // браузер создаёт событие submit на форме по нажатию на enter или на кнопку создания дела
    todoItemForm.form.addEventListener("submit", function (e) {
      // эта строчка необходима чтобы предотвратить стандартное действие браузера, в данном случае мы нет хотм чтобы форма перезагружалась при отправки формы
      e.preventDefault();

      // игнорируем создание элемента если пользовательнечего не ввел в поле
      if (!todoItemForm.input.value) {
        return;
      }

      let newItem = {
        id: getNewId(listArr),
        name: todoItemForm.input.value,
        done: false,
      };

      let todoItem = createTodoItem(newItem);

      listArr.push(newItem);

      saveList(listArr, listName);

      // // создаём и добавляем в список новое дело с названием из поля для ввода
      todoList.append(todoItem.item);

      todoItemForm.button.disabled = true;

      // обнуляем значение в поле чтобы не пришлось стирать его вручную
      todoItemForm.input.value = "";
    });
  }

  window.createTodoApp = createTodoApp;
})();
