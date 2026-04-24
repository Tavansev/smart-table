import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы
    [...before].reverse().forEach(subName => {
        root[subName] = cloneTemplate(subName);
        root.container.prepend(root[subName].container);
    });

    // Добавляем шаблоны ПОСЛЕ таблицы (after)
    after.forEach(subName => {
        root[subName] = cloneTemplate(subName);
        root.container.append(root[subName].container);
    });

    // @todo: #1.3 —  обработать события и вызвать onAction()
    root.container.addEventListener('change', () => {
        onAction();  // Вызываем без аргументов
    });

    // Событие reset - когда нажата кнопка сброса формы
    root.container.addEventListener('reset', () => {
        // Используем setTimeout, потому что поля очищаются не мгновенно
        setTimeout(() => onAction(), 0);
    });

    // Событие submit - когда форма отправлена (нажата любая кнопка submit)
    root.container.addEventListener('submit', (e) => {
        e.preventDefault();  // Отменяем перезагрузку страницы
        onAction(e.submitter);  // Передаём кнопку, которая вызвала отправку
    });

    const render = (data) => {
        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);

            Object.keys(item).forEach(key => {
                if(row.elements[key]) {
                    row.elements[key].textContent = item[key];
                }
            });
        
            return row.container;
        });
    
        root.elements.rows.replaceChildren(...nextRows);
    }

    return {...root, render};
}