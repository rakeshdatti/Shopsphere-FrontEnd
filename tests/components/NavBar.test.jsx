import { render,screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "../../src/components/NavBar";
import { MemoryRouter, NavLink } from "react-router-dom";
import { AuthContext } from "../../src/context/AuthContext";
import { cartContext } from "../../src/context/CartContext";
import { ThemeContext } from "../../src/context/ThemeContext";



const renderWithProviders=({
    user=null,
    totalItems=0,
    logout=jest.fn(),
    theme="light",
    toggleTheme=jest.fn(),
}= {})=>{
    return render(
        <MemoryRouter initialEntries={["/"]}>
            <AuthContext.Provider value={{user,logout}}>
                <cartContext.Provider value={{totalItems}}>
                    <ThemeContext.Provider value={{theme,toggleTheme}}>
                        <Navbar/>
                    </ThemeContext.Provider>
                </cartContext.Provider>
            </AuthContext.Provider>
        </MemoryRouter>
    )
}


test("render navBar with links ",()=>{
   renderWithProviders();

   expect(screen.getByText("ShopSphere")).toBeInTheDocument();
   expect(screen.getByRole("link",{name:/products/i})).toBeInTheDocument();
   expect(screen.getByRole("link",{name:/cart/i})).toBeInTheDocument();
   expect(screen.getByRole("link",{name:/orders/i})).toBeInTheDocument();
})


test("show cart badge when items exist",()=>{
    renderWithProviders({totalItems:3})

    expect(screen.getByText("3")).toBeInTheDocument()
})

test("shows login button when user test not logged in",()=>{
    renderWithProviders({user: null});
    expect(screen.getByRole("link",{name: /login/i})).toBeInTheDocument()
})

test("shows user email and avator when user logged in",()=>{
    const user={email: "rakeshdatti2@gmail.com"}

    renderWithProviders({user})

    expect(screen.getByText("rakeshdatti2@gmail.com")).toBeInTheDocument();
})

// test("toggles theme when button clicked", async () => {
//   const toggleTheme = jest.fn();

//   renderWithProviders({ toggleTheme });

//   const button = screen.getByRole("button", { name: /toggle theme/i });

//   await userEvent.click(button);

//   expect(toggleTheme).toHaveBeenCalledTimes(1);
// });


test("calls logout when logout button clicked",async()=>{
    const logout=jest.fn()
    const user={email: "rakeshdatti2@gmail.com"}
    renderWithProviders({user,logout})

    const button=screen.getByRole("button",{name:/logout/i})
    await userEvent.click(button)

    expect(logout).toHaveBeenCalledTimes(1);
})