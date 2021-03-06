---

title   : "Objects and Methods"
author  : "__zaika_denis"
date    : 2019-09-22T08:01:41+04:00
draft   : false
postid  : "C.02"
postdesc: "rationalization of methods"
tags    : ["fortran", "julia", "c++"]
thumb   : "/posts/objects-and-methods/thumb.jpg"
---

Семейство императивных языков программирования демонстрирует удивительное многообразие. И хотя на первый взгляд
может показаться, что различий между отдельными представителями не существует, разработчики новых языков всё же
находят основания для того, чтобы называть свой продукт следующей ступенью в развитии семейства. Мы, в свою очередь,
попробуем выделить рациональные основания такого многообразия, которые не всегда гарантируют расширение общей 
парадигмы, предлагая вместо этого субъективное ощущение упорядоченности.

Валентин Фёдорович Турчин - разработчик языка Refal, в своих работах часто оперирует понятием метасистемного
перехода - удобным инструментом для анализа развития кибернетических моделей, позволяющим определять необходимые условия для расширения базовой сущности. Но в 
контексте императивных языков программирования лучше воспользоваться упрощённой версией метасистемного перехода, а именно макро-подстановкой. Здесь стоит отметить, 
что я имею ввиду более развитые средства рефлексии, такие как макросы *Julia* или механизмы символьной подстановки *Mathematica*, нежели чем препроцессор *C*. И 
поскольку целью данной статьи является сравнение различных подходов к объектно-ориентированному программированию, то класс рассматриваемых языковых конструкций 
также будет ограничен.

Началом системы координат в пространстве наших исследований положим язык *С* - один из простых, и в то же время выразительных языков программирования. Иногда 
именуемый макроассемблером, он прекрасно справляется с поставленной задачей, а именно абстракцией вычислительных ресурсов. Так как *С* является низкоуровневым, 
многие современные парадигмы конструирования программных комплексов реализуются в нём неоправданно сложно, что вынуждает обращаться к средствам макро-контроля, 
которые в свою очередь способствуют появлению новых языков в семействе. И хотя не все потомки являются синтаксическим расширением *C*, многие из них можно 
рассматривать как средства автоматизации, предназначенные для упрощения применения уже сложившихся практик. Так например компилятор языка *Go*, взял на себя 
функции управления многопоточностью, избавив программиста от лишних задач связанных с распределением ресурсов. Хотя и параллельные вычисления, и сборку мусора 
можно было реализовать средствами самого *С*, выглядело всё это некрасиво, и очень часто
являлось источником ошибок трудных для выявления.

Что касается объектов, то и здесь ситуация в основном сводится к стремлению избавить программиста от ввода лишних символов. Даже язык *С++* практически не добавил 
ничего нового - конструкторы, деструкторы и виртуальные классы
существовали в языке *С* всё время (что может быть виртуальней *void), только они не были частью языка и не имели
поддержки со стороны компилятора. Вообще, как мне кажется, язык *Go* гораздо ближе к *C* по духу чем *С++*. Хотя
последние стандарты *С++* приятно удивляют своим стремлением следовать современным тенденциям.  

Для лучшего понимания свойств тех или иных синтаксических конструкций, мы будем вводить их постепенно, стараясь максимально избегать их использования. Иногда это 
может казаться странным, но только так можно показать, что
в какой то момент исторического развития были альтернативные пути. А начнём мы с уточнения необходимости структурных
типов данных. 

Представим некоторую двухмерную точку ...

```c
float point_x = 0.5;
float point_y = 1.7;
```
но это только одна точка, если бы нам понадобилось множество то ...

```c
float point_x[n]; // статический массив
float point_y[n];

float *point_x;  // динамический массив 
float *point_y;
```

то есть мы уже можем вычислить одну NURBS или Bezier кривую. Если нужно рассчитать несколько объектов ...

```c
float **point_x;
float **point_y;
```

в принципе, этого достаточно для реализации какой нибудь программы позволяющей просматривать чертежи. Все кривые
будут храниться в некотором глобальном массиве, плюс цепочка функций занимающаяся тесселяцией и отрисовкой на
экране. Кстати программы для просмотра чертежей одни из самых древних и появились они задолго до объектно-ориентированного программирования. Но давайте разберёмся 
в том, какие факторы всё таки вынуждают нас переходить к использованию структурных типов данных. 

Например, есть некоторая функция plot(float *px, float *py) выполняющая отрисовку кривой Bezier на экране, для этого нам нужно суммировать все точки помноженные на 
базис. Если мы пользуемся не *Fortran* а *С*, то нам необходимо знать  количество точек кривой, для правильной работы суммирующего цикла. Если исключить 
использование NAN-терминированных последовательностей по аналогии со строками, то единственной возможностью для нас будет переопределение 
plot(float *px, float *py, int num) ...

```c
float **point_x;
float **point_y;
int  *point_num;

plot(point_x[1], point_y[1], point_num[1]);
```

даже большее количество атрибутов кривой вряд ли побудит нас к использованию структур, ведь всегда можно написать ...

```c
float **point_x;
float **point_y;
int **curve_attributes;

plot(point_x[1], point_y[1], curve_attributes[1]);
```

а имена атрибутов кодировать числовыми константами или перечислением. Как видим, есть класс программ для которых
очень сложно обосновать необходимость использования составных типов. И если наши примеры игрушечные, то существуют
целые расчетные комплексы подобные описанному в книге "Computational Plasticity for Finite Elements", которые вообще
не используют структурные типы данных. Вот только информация в такие системы поступает статически в виде файлов, что
позволяет заранее выделить необходимое количество ресурсов. Постойте, а что если поставить условие динамического ввода
информации, например пользователь рисует кривую на сенсорном экране точку за точкой. Тогда наше представление данных
основанное на массивах оказывается неэффективным, ведь мы должны указывать точные объемы выделяемой памяти которые
мы не можем знать заранее, а использование динамических структур данных таких как связанные списки будет способствовать 
нашему переходу к составным типам. Но нет, буфер ввода можно выделять больше необходимого объёма, а после копировать
данные в массив соответствующего размера. Так что, лучше попробуем расширить многообразие представляемых объектов.
Для этого можно взять гипотетическую функцию проецирующую трёхмерную кривую на поверхность.

```c
float *curve_point_x;
float *curve_point_y;
float *curve_point_z;

float *result_point_x;
float *result_point_y;
float *result_point_z;

float *surface_grid_x;
float *surface_grid_y;
float *surface_grid_z;

project(curve_point_x, curve_point_y, curve_point_z, 
        surface_point_x, surface_point_y, surface_point_z, 
        return_point_x, return_point_y, return_point_z);
```

Но даже в этом случае можно всё упростить объединив координаты в один массив...

```c
float **curve;
float **surface;
float **result;

project(curve, surface, result);
```

также следует учесть то, что *С* в отличии от *Fortran* не знает размер динамических массивов и нам его нужно будет
передавать в каждую функцию. Использование структур значительно упрощает передачу аргументов, особенно если
передаваемые объекты являются большими блоками разнородных данных. А вот насчет представления точки как структуры я не уверен, поскольку в таком случае мы теряем возможность применения векторизованных операций. Например *Fortran* функция вычисляющая длину вектора ...

```fortran
function norm(vector)
    real :: norm
    real :: vector(:)

    norm = sqrt(sum(vector**2))
end
```

может работать с вектором любой размерности, в то время как её структурная *С* версия ...

```c
float norm(vector v) {
    return sqrt(v.x^2 + v.y^2 + v.z^2);
}
```

ограничена конкретной размерностью, хотя встречается повсеместно, особенно в языках не поддерживающих
векторные операции. Тем не менее, несмотря на то, что такие классы как Point или Vector смотрятся отвратительно,
в целом очень сложно обойтись без некоей абстракции способной объединить разнородные данные. Почти во всех языках
программирования имеются такие средства, разница состоит только в том насколько глубоко они интегрированы в общую
парадигму. Одной разновидностью такой интеграции являются объекты или классы, которые можно встретить в
таких языках как *Java* и *С#*. В *Fortran* тоже имеются подобные механизмы вот только реализованы они гораздо
лучше, например  ...

```fortran
type, public :: colored_point
    real    :: x, y, z
    int     :: id
    real    :: hsv(3)
end type
```

Тип colored_point представляет собой цветную точку обозначенную некоторым целочисленным идентификатором. Все типы
интегрируются в языковую парадигму *Fortran* следующим образом ...

```fortran
type(colored_point), dimension(10) :: many_points ! множество точек

// знак % это как . в с#

print *, many_points % id   ! выводит идентификаторы всех точек 
many_points % hsv    = 0.5  ! запрещено !!! hsv не элементарный тип
many_points % hsv(1) = 0.5  ! задаёт первый компонент цвета
many_points(1) % hsv = 0.3  ! задаёт цветовые компоненты первой точки
many_points % brightness()  ! вычисляет яркость всех точек 
end
```
Как мы видим разработчики *Fortran* постарались максимально встроить объекты в общую концепцию работы с массивами.
Если бы они неосмысленно копировали то, что уже сделано в Java или С#, то основное преимущество языка было бы потеряно.
В частности, операция many_points.brightness() утратила бы своё значение, так как объект массива не содержит метод brightness(). В этом отношении Фортран довольно 
прогрессивен, во многих других языках за исключением Python и Julia невозможно создавать контейнеры, которые являются векторизованными копиями содержащихся в них 
элементов. Объектность контейнеров, по типу того как она реализована в Java или С#, перекрывает возможность непосредственной работы с множеством данных, то есть 
для их обработки необходимо прибегать к таким конструкциям как foreach или map/reduce. В то же время, более продуманные языки дают возможность использовать 
конструкции типа sum(circles[circles.length() > 5].area()) -
сумма площадей всех окружностей чей периметр больше 5. Но для этого разработчикам языков необходимо быть
программистами, а не маркетологами. Как я никогда не понимал зачем в фильме "Парк Юрского Периода" машины с резиновыми колёсами прикреплены к рельсам, точно так-же 
я не понимаю зачем разработчики таких языков как Java или C# прикрепили их к монолитным системам типов. Гораздо лучше было бы дать программистам возможность самим 
настраивать семантику связанных с объектами синтаксических структур.

Итак, мы согласились, что составные типы облегчают жизнь программистам. Особенно когда они хорошо интегрированы в язык, что не всегда имеет место. Но как обстоят 
дела с другими концепциями без
которых сегодня уже невозможно представить объектно-ориентированное программирование. Начнём с "синтаксического сахара"
под названием методы. Многие исследователи полагают, что кроме загромождения блока данных, функции прилепленные
к некоторому классу ничего не дают. От такого понимания методов отказались Go и Julia, а управление многообразием функций в них реализовано посредством модулей, 
что значительно удобнее классов. Например если объект array имеет
связанный с ним медленный метод sort, то заменить его на более эффективный метод с тем же именем можно просто - подключив
другой модуль переопределяющий функцию sort. Если вы не хотите перекрывать базовый метод, то имеется возможность переименовать новый метод с помощью директивы 
импорта import new_module.sort as quick_sort. Так получилось, что
именно языки без модулей обладают самыми сложными системами типов, очевидно, пытаясь компенсировать недостаток
функциональности. 

Рассмотрим простую конструкцию ...

```c
// связанный список
struct list {
    list *prev;
    list *next;
    void *data;
};

// и некоторые методы 

void sort(list l);
void append(list l, void* d);
void extend(list l1, list l2);

// lst.append(some_data) это всего лишь append(lst, some_data)

list lst;
lst.append("hello world");

```

Для совершения такой подстановки, совсем не нужно было делать всё то, что было сделано в C++. Более
сообразительные разработчики идут по пути применения так называемых интерфейсов - предопределённых методов
задающих поведение объекта ...

```c
list.length         => get(this, "length");
list.length = 10    => set(this, "length", 10);
list.hello("hi")    => cal(this, "hello", args...);

// таким образом можно передавать сообщения содержимому списка

list.x += 10    => cal(this, "+=", 10) = map((obj) -> obj.x += 10, this.elements);

// хотя у списка отсутствует свойство x, оно есть у содержащихся в нём элементов
// задание этого свойства у списка автоматически перенаправляется элементам.
//
```

Вообще, все тяжелые и раздутые языки стали популярными на волне бизнес-программирования,
в те времена, когда в лексиконе разработчиков появились такие слова как менеджмент, инфраструктура, делегат,
предприятие, транзакция, брокер, всё это требовалось для того чтобы доказать руководству что ты не просто
программист, но ещё и талантливый менеджер способный занимать высокие должности в иерархии корпорации.
Конечно, времена пейджеров и сотовых телефонов с большими антеннами давно прошли, но менталитет 
программиста-бизнесмена остаётся до сих пор, и чем проще возникающие задачи, тем больше на них навешивается
бесполезных украшений, только лишь ради доказательства того, что их решение требует значительных инвестиций.
И хотя бизнес для бизнеса продолжает приносить прибыль, многие компании начинают понимать, что исключительно
менеджментом невозможно добиться прорывных технологий, более того, оторванные от конкретной области абстрактные
теории управления предприятием очень часто являются причиной низкой эффективности.

В заключение хочу отметить, что и методы и структуры являются очень хорошими инструментами, но только
в том случае если они не идут вразрез основным концепциям языка программирования. Структуры должны
оставаться чистыми данными, без лишних украшений. Методы должны находиться в модулях и связываться со
структурами с помощью компилятора. А объектные модели должны создаваться с помощью специальных интерфейсов.
Как видим, мы недалеко ушли от начальной точки, по крайней мере мы находимся к ней гораздо ближе чем
специалисты по маркетинговым языкам программирования.

# редакция

Так как я сейчас являюсь фанатом Julia, хочу напомнить, что несмотря на то, что язык официально
не позиционируется как объектно ориентированный, привязка методов к структурам осуществляется через ...

```julia
mutable struct MyStruct
    id::Int64
    name::String
end

function display(this::MyStruct)
    println("=> id:", this.id, " name:", this.name)
end

function merge(this::MyStruct, other::MyStruct)
    this.id += other.id
    this.name *= other.name
    return this
end

function Base.getproperty(this::MyStruct, name::Symbol)
    try
        f = eval(name)
        return (args...) -> f(this, args...)
    catch UndefVarError
        return Base.getfield(this, name)
    end 
end

# теперь можно использовать

m1 = MyStruct(123, "hello_")
m2 = MyStruct(456, "world")

m1.merge(m2)
m1.display()

```

И хотя С++ - моя первая любовь, в плане объектно-ориентированного программирования он далеко позади Julia.