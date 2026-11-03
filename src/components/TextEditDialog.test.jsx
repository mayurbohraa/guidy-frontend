import {fireEvent,render,screen,waitFor} from "@testing-library/react";
import TextEditDialog from "./TextEditDialog";
test("editing retains keyboard focus and saves the new value without reloading",async()=>{
 const save=jest.fn().mockResolvedValue({});const close=jest.fn();
 render(<TextEditDialog title="Edit task" initialValue="Old task" hint="Up to 60 characters." maxLength={60} save={save} close={close}/>);
 const input=screen.getByLabelText("Task description");
 expect(input).toHaveFocus();
 fireEvent.change(input,{target:{value:"Updated task"}});
 expect(input).toHaveFocus();
 fireEvent.click(screen.getByRole("button",{name:"Save changes"}));
 await waitFor(()=>expect(close).toHaveBeenCalledWith("Updated task"));
 expect(save).toHaveBeenCalledWith("Updated task");
});
