// const model=require('../model/product');
// const allUserProduct=async(req,res)=>{
//     try{
//         let userData=await model.fetchData();
//         if(userData){
//             res.render('User/Products',{
//                 title:'All products',
//                 data:userData
//             })
//         }
//     }catch(error){
//         console.log("Data not Found",error);
//     }
// }

// const singleProduct=async(req,res)=>{
//     try{
//         let product_id=req.params.id;
//         // console.log("collected Id:",product_id);
//         let singleValue=await model.findId(product_id);
//         // console.log("collected product Details By Id:",singleValue);
//         if(singleValue)
//         {
//             res.render('User/ProductDetail',{
//                 title:"Products All detais",
//                 data:singleValue
//             })
//         }
//     }catch(error){
//         console.log("Product not Found",error);
//     }
// }
// module.exports={
//     allUserProduct,
//     singleProduct
// }