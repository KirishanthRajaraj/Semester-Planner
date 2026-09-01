what type of component would be easiest to       
  manage for being able to text input, tab indent text, highlight text in that  
  component. every new line should be distinguishable since im going to use     
  them for further processing. currently i have textarea component from shadcn  
  that i use. what options do i have. i plan later on to maybe even transform   
  the individual line items, indented items. what input option would be easiest to       
  implement and manage               

i have created a branch to test out this code mirror input option. i would    
  like to replace everything in textareaplanner.tsx with a very basic           
  implementation of code mirror. there seems to be a codemirror block           
  implementation that already
  does something similar to what i need. i want a very basic editor. no code    
  syntax highlighting, this wont be used by coders. only background             
  highlighting for specific words possible, tab indenting possible. don't       
  connect it to chrono node yet, keep it simple, as little config as possible.

  i need to implement zustand in this project. can you create the boilerplate   
  for it. keep it minimal.

  in textareaPlanner.tsx, where i have the button that calls linestotaskitem    
  right now. i want to link to another page with the button, but wait for it to 
  finish executing linestotaskitem function.

  sobald ich einen sortableTask in einen droppable schiebe, bei dem es noch     
  kein sortabletask gibt bekomme ich "Each child in a list should have a unique 
  "key" prop." error

  i need to add localStorage usage for my store items, so they don't keep disappearing after  
  i refresh, how should i plan this, should i create a hook for it and use that 
  on every page that needs it, replace it with the current useTaskStore,        
  useSemesterStore Zustand hooks i have

  within textareaplanner, im doing a reverse, taskitem to text function. can you 
  tell me what syntax i need for inserting individual lines, with indentation   
  without writing the code 

  i want to conditionally render styles to tablerow for datatable, the problem  
  is i need to pass in the taskitem, but datatable is generically written 

  for the status updates in taskstable i was thinking of something like a collapsable radio group, with icons or colors as     
  options, where the user can set status of the task in the taskstable. in the  
  status cell. maybe you can use a shadcn component as a basis or if its easier 
  custom one. on hover to make it seamless, no extra mouse movement or so       
  needed, maybe like three segments todo, inprogress, done 

  adjustments for textarea, statusmanagement with status property of taskItem. :done: token within thex text should be decorated green, :doing: should be orange, :done: tasks should also be striked out, they should be cleaned from the text like date. 

  where do i define a default value for semesterstore start and enddate, if there is nothing defined in localstorage or in store.

  i need to change the sidebar to not push my body content, but to go over it, like an overlay when uncollapsed. an icon for each the textareainput, overview page and plan dnd   
    page. the icons should be directly clickable without having to uncollapse.

  variante 1: kein parent akkordeon, parents nicht anzeigen im dnd, mit dem handle oben für move all siblings. hier kann ich mir vom Benutzer vorstellen, dass er kein komplettes parent/child mutation ist möglich    
  auf dieser dnd erwartet. und ich auch sortable nicht anfassen muss, was ich aktuell abgeschalten habe. die glühbirne als toggle um alle items die nicht siblings oder descendants (children von siblings) sind werden ausgegraut. variante 2:  
  parent akkordeon mit vereinfachter parent/child mutation, hinzufügen von einem parent möglich, task ganz löschen wie jetzt schon möglich, restructering nicht möglich von einem parent zu einem anderen. kein move siblings/descendants        
  handle, wenn man mehrere moven will, sucht man das parent akkordeon und moved so alle descendants. hier müsste gehandelt werden was wenn ein parent alleine an einem datum steht und alle children irgendwo anders wären, nur eine parent      
  kategorie an einem datum haben, was vielleicht sogar vor den daten der child tasks sein könnte macht kein sinn, wie werden child tasks gekennzeichnet die ausserhalb des parent datums sind, auch mit glühbirne toggle? oder wenn mehr als ein 
  task mit dem selben parent einem ort ist, wird immer automatisch das parent akkordeon angezeigt auch wenn das parent datum nicht offiziell dort ist? ich weiss nicht ich habe das gefühl hier müsste ich einiges mehr handeln. Variante 3:     
  volles dnd mit parent akkordeon und dnd parent child mutation. sortable aktiviert. kennzeichnung was passiert während dem drag, oberhalb eines tasks aber immernoch unterhalb des oberen tasks heisst platziere den task dort, auf einem task  
  heisst mache aus dem gedraggtem ein child element, usw. welche version schlägst du vor, und kannst du mir eine ungefähre aufwandsschätzung für alle geben in h.

  i want to publish to vercel, can you clean my entire project so that the upload to vercel won't fail. no logic
  changes. remove unused packages and so on.

  for the planpreviewer, i don't think i need to see the titles, or make crud actions available. i think i just need a one page overview, where i can have an overview, and a preview of what i'm typing

  kleine quadrätchen, wenn nicht genug auf einen tag platz haben, dann newline für diesen tag, wird halt die  
  höhe höher. inbox sollte auch irgendwo sichbar sein. man sieht den titel mit dem tooltip oder aria label, aber es sollte direkt sichtbar sein, hier am besten den shadcn tooltip nehmen. die heatmap möchte ich behalten, aber sollte eine richtige heatmap werden, ein task gleich primary/20, 2 gleich bg-primary/20 usw. die     
  zwei modi kann man per tab wechseln.

  Ich möchte den initialtext für meinen textplaner verbessern, um alle funktionen kurz aufzuzeigen. und meine dotmap / heatmap zeigen, dort sollte die daten möglichst verteilt sein, einige sollten mehrere tasks an diesem Tag sichtbar haben. tasks die parents sind werden aktuell nicht aufgezeigt, als info.
ich möchte es allgemein halten, dass alle studenten sich angesprochen fühlen mit den beispielaufgaben, aber nicht zu allgemein, dass es zu fremd oder abstrakt klingt und relatable ist. eine gewisse tiefe sollte gezeigt werden, hätte gesagt vielleicht bis tiefe 4, damit sie verstehen, dass sie wirklich tief planen können.

ich möchte mehr nützliche statistiken bei der overview page zeigen. die einem einen überblick über das semester     
  geben. die charts mithilfe shadcn charts und recharts. ich möchte sicher einen pie chart.   
  einen bar chart, sofern das sinn macht, und sonstige die sinn machen.

  ich möchte Plänlify so wie es im info modal dargestellt wird mit textmarker highlight als logo haben oben links im  
  sidebar oder so. ausserdem ist die sidebar animation mir zu langsam. und als favicon der website das P als          
  highlight

ich möchte task cascading auch für den textplaner implementieren
kannst du mir den unterschied zwischen dieser separaten zeilen und depth handling erklären, und wenn ich das
status kascadieren einfach mit den bestehenden parentids gemacht hätte, wäre das überhaupt möglich gewesen, was    
wären die nachteile gewesen

ich möchte dass die decorations für up und down cascade von status im textplaner mit  
dem durchstreichen von parent oder alle children sichtbar ist, und nicht erst im roundtrip passiert. jetzt 
würde die implementation mit parentid nicht funktionieren oder? falls es nicht funktioniert, gibt es keinen weg um dieses 
doppelte durchgehen von allen parsed lines zu vermeiden?

welche möglichkeiten habe ich um ein hinweis aus jsx auf gewisse zeilen einzublenden für den text planer. ich möchte einen passiven date cascade implementieren. wenn ein parent ein date hat, erben die kinder, die keine eigenen dates definiert haben den von den eltern 