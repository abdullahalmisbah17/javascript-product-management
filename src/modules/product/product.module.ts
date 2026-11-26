import axios from "axios";
import type { IProduct } from "./product.type";
import Toastify from 'toastify-js'

import api from "../../../lib/api";


let add_product_form: HTMLElement | null = document.getElementById("add_product_form");

// products rendering;

async  function productRender(){

try {
  let res = await api.get("/product")
  //  let productGrid = document.getElementById('product_grid');
   let table_body = document.getElementById("table_body");
  //  if (productGrid) {
  //    productGrid.innerHTML = makeProductHtmlCode(res.data).homePageHtml;
  //  };

   if(table_body) {
    table_body.innerHTML = makeProductHtmlCode(res.data).dashboardPageHtml;
   }

} catch (error) { 
  console.log(error);
  
}

}

productRender();

// create product;
add_product_form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(add_product_form as HTMLFormElement);

    const entries = Object.fromEntries(formData.entries()) as unknown as IProduct;

    const validatedFormData = validate(entries);

//  stop here if validation fails


  if (!validatedFormData) {
        return;
    }

    try {

        let res = await api.post('/product', validatedFormData)

        console.log(res);

        if (res.status == 201) {
            Toastify({
                text: "Product added successfully",
                className: "success",
                // style: {
                //     background: "red",
                //     color: "white",
                //     border: "1px solid black"
                // }
            }).showToast();

            (add_product_form as HTMLFormElement).reset();

            setTimeout(() => {
                window.location.replace("/dashboard")
            }, 3000);

        }


    } catch (error) {
        console.error(error);

        Toastify({
            text: "Failed to add product",
            className: "error",
        }).showToast();
    }
});


// ========================  Helper function ===================================

function validate (formData: IProduct){
   
   let conditions = 
 formData.name == ""
 || !formData.image
 || Number(formData.price) <= 0
 || !formData.ratting
 

    if(conditions) {
Toastify({
  text: "Please fill all required form fields.",
  className: "info"
}).showToast();
return null;
    }
return formData;

}
// make product html code
function makeProductHtmlCode(arr: IProduct[]){ 
let homePageHtml = "";
let dashboardPageHtml = "";
arr.forEach((item, index) =>  {

  // homePageHtml += `
  //        <article
  //            class="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
  //          >
  //            <!-- Image -->
  //            <div class="h-64 overflow-hidden">
  //              <img
  //                src="/src/assets/images/food/${item.image}"
  //                alt="this is alt text"
  //                class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
  //              />
  //            </div>
  //            <!-- Content -->
  //            <div class="p-5">
  //              <!-- Title -->
  //              <h3 class="text-xl font-semibold text-slate-900">
  //                ${item.name}
  //              </h3>

  //              <!-- Rating + Price -->
  //              <div class="mt-4 flex items-center justify-between">
  //                <!-- Rating -->
  //               ${rattingCount(item.ratting)}
  //                <!-- Price -->
  //                <span class="text-xl font-bold text-slate-900"> $${Number(item.price).toFixed(2)} </span>
  //              </div>

  //              <!-- Add To Cart -->
  //              <button
  //                type="button"
  //                class="mt-5 w-full rounded-xl bg-[#D99400] px-5 py-3 font-semibold text-white transition duration-300 hover:bg-[#b97d00]"
  //              >
  //                Add to Cart
  //              </button>
  //            </div>
  //          </article>
  //       `;

        dashboardPageHtml += 

        `   <tr class="transition hover:bg-gray-50">
                        <td class="px-5 py-3">
                            ${index + 1}
                        </td>
                        <td class="px-5 py-3">
                            <img src="/src/assets/images/food/${item.image}" alt="Product"
                                class="h-14 w-14 rounded-lg object-cover" />
                        </td>

                        <td class="px-5 py-3">
                            <p class="font-medium text-gray-900">
                                ${item.name}
                            </p>
                        </td>

                        <td class="px-5 py-3">
                            <span class="font-semibold text-gray-900">
                                $${Number(item.price).toFixed(2)}
                            </span>
                        </td>

                        <td class="px-5 py-3">
                            <div class="flex items-center gap-1">

                                <span class="ml-1 text-xs text-gray-500">
                                    ${item.ratting}
                                </span>
                            </div>
                        </td>

                        <td class="px-5 py-3">
                            <div class="flex items-center justify-end gap-2">
                                <a 
                                href="edit-product?productId=${item.id}"
                                    class="cursor-pointer rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100">
                                    Edit
                                </a>

                                <button
                                    data-id="${item.id}"
                                    class="cursor-pointer delete-product rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100">
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>
        
        `


})

function rattingCount(n: number){

let starts = "";

for(let i = 0; i <= 4; i++ ){

 if(n > i){
   starts += ` <span class="text-lg text-[#D99400]">★</span>`
  }
  
  else{
    starts += ` <span class="text-lg text-gray-400">★</span>`
  }
}

return`
                    <div class="flex items-center gap-0.5" aria-label="4 out of 5 stars">${starts}</div>
`

} 

return {
  homePageHtml: homePageHtml,
  dashboardPageHtml: dashboardPageHtml
}; 

}
