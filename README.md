## Supuestos

se consideraron los siguientes supuestos a la hora del desarrollo de la solucion
- Se solicito que la relacion de las entidades libros y autores fuera muchos a muchos, en mongo al ser una base de datos no relacional hay muchas formas de lograr esto,para que el sistema sea mas escalable a futuro se tomo como referencia el ID del author se guarde en un arreglo dentro de los atributos del libro, esto porque hace que las busqeudas puedan ser mas eficientes, es mucho mas pobrable que un autor tenga muchos libros no asi los libros, ya que es raro que se tenga mas de 3 o 4 autores de una misma obra. 
- Se tomo el Id del autor de referencia y no el nombre ya que en un futuro se podrian agregar mas atributos de este lo que pudiera hacer mas complejas las busquedas 
- se considera cada nombre de autor como unico, esto porque es el unico atributo que se tiene de la entidad (en un futuron esto podria cambiar si se requiriera)
- los nombres de los libros se puedes replicar ya que se podrian filtar por diferencia de autores,
-
## Mejoras pendientes
- se podrian agregar mas test para la verificacion del correcto funcionamiento de la solucion
- se podria usar sessiones en la creacion de autores y libros de manera que toda intervencion con la base de datos sea atomica y no existan perdidas

