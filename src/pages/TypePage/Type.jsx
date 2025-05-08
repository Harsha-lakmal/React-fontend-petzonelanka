import  instance from '../../Service/AxiosHolder/AxiosHolder.jsx'
import  Navbar from '../../components/Navbar/Navbar.jsx'

export default function Type() {

  
  //   stock type function

  function felectToStockType() {
    try {
      instance
        .get("/pet/getAllPetType", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((respose) => {
          console.log(respose);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }

  function deleteToStockType() {
    const id = {
      petTypeId: petTypeId,
    };
    try {
      instance
        .delete("/pet/deletePetType", id, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((respose) => {
          console.log("delete to stock type .. ");
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }

  function updateToStcokType() {
    const updateStockType = {
      petTypeId,
      name,
    };
    try {
      instance
        .put("/pet/updatePetTpye", updateStockType, {
          headers: {
            Authorization: `Bearer ${token} `,
          },
        })
        .then((respose) => {
          console.log(" Updete to stock type ..");
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }

  function  addToStcokType (){
    const newStockType  = {
        name
    }
    try {
        instance.post('/pet/createPetType'  , newStockType   ,{
            headers : {
                Authorization : `Bearer ${token}`
            }
        }).then(respose =>{
            console.log("add to pet type ");
            
        })
        .catch(error =>{
            console.log(error);
            
        })
        
    }catch(error) {
        console.log(error);
        
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-blue-50" >
      <Navbar page  = "type" />
    </div>
  );
}
