const _=require('lodash');
const {VpsCategory,validate}=require('../models/vpsCategory');

module.exports.createCategory=async(req,res)=>{
  const{error}=validate(_.pick(req.body,['name']));
  if(error) return res.status(400).send(error.details[0].message);

  const category=new VpsCategory(_.pick(req.body,['name']));
  const result=await category.save();

  return res.status(201).send({
    message:'Category Created Successfully!!!',
    data:{
      name:result.name
    }
  })

}
module.exports.getCategory=async(req,res)=>{
  const categories=await VpsCategory.find()
  .select({_id:1,name:1})
     .sort({name:1});

     return res.status(200).send(categories);


}