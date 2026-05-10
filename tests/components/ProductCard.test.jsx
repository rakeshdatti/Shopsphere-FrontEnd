import {render,screen} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import ProductCard from "../../src/components/ProductCard"
import '@testing-library/jest-dom';
import { MemoryRouter } from "react-router-dom";

import { cartContext } from "../../src/context/CartContext";
import { AuthContext } from "../../src/context/AuthContext"




//mock the useNavigate
const mockNavigate=jest.fn();


jest.mock('react-router-dom',()=>({
    ...jest.requireActual("react-router-dom"),
    useNavigate: ()=> mockNavigate

}));

const product={
    _id: "1",
    title: "Test Product",
    price: 100,
    image: "test.jpg"
}


test("renders product details",()=>{
    render(
        <MemoryRouter>
            <cartContext.Provider value={{cart: [],addToCart: jest.fn()}}>
                <AuthContext.Provider value={{ user: {name: "Rakesh"}}}>
                    <ProductCard product={product}/>
                </AuthContext.Provider>
            </cartContext.Provider>
        </MemoryRouter>
    )

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText(/₹/)).toBeInTheDocument();
    expect(screen.getByRole("img")).toBeInTheDocument();
})

test("show addToCart button when product is not in cart",()=>{
    render(
        <MemoryRouter>
            <cartContext.Provider value={{cart:[],addToCart: jest.fn()}}>
                <AuthContext.Provider value={{ user: {name: "Rakesh"}}}>
                        <ProductCard product={product}/>
                </AuthContext.Provider>
            </cartContext.Provider>
        </MemoryRouter>
    );

    const button=screen.getByRole("button",{name: /Add To Cart/i});
    expect(button).toBeInTheDocument()
})


test("show GoToCart button when product is in cart",()=>{
    const cart=[{productId: "1"}]
    render(
        <MemoryRouter>
            <cartContext.Provider value={{cart,addToCart: jest.fn()}}>
                <AuthContext.Provider value={{ user: {name: "Rakesh"}}}>
                        <ProductCard product={product}/>
                </AuthContext.Provider>
            </cartContext.Provider>
        </MemoryRouter>
    );

    const button=screen.getByRole("button",{name: /Go To Cart/i});
    expect(button).toBeInTheDocument()
})


//check when clicking on addtocart is actually calling addToCart function

test("calls addToCart when clicking Add To Cart",async ()=>{
    const addToCart=jest.fn()
    render(
        <MemoryRouter>
            <cartContext.Provider value={{cart:[],addToCart}}>
                <AuthContext.Provider value={{ user: {name: "Rakesh"}}}>
                        <ProductCard product={product}/>
                </AuthContext.Provider>
            </cartContext.Provider>
        </MemoryRouter>
    );

    const button=screen.getByRole("button",{name: /Add To Cart/i});
    await userEvent.click(button)

    console.log("Clicked")
    expect(addToCart).toHaveBeenCalledWith(product)
})


test("",()=>{

})

//redirect to login page if user is not logged in
test("redirects to login if user is not logged in",async()=>{
    render(
        <MemoryRouter>
            <cartContext.Provider value={{cart:[],addToCart: jest.fn()}}>
                <AuthContext.Provider value={{ user: null}}>
                        <ProductCard product={product}/>
                </AuthContext.Provider>
            </cartContext.Provider>
        </MemoryRouter>
    );

    const button=screen.getByRole("button",{name: /add to cart/i});
    await userEvent.click(button)
    expect(mockNavigate).toHaveBeenCalledWith("/login")
})