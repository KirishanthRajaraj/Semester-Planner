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