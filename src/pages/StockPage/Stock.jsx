import Navbar from "../../components/Navbar/Navbar.jsx";
import instance from "../../Service/AxiosHolder/AxiosHolder.jsx";

export default function Stock() {
  const token = localStorage.getItem("authToken");

  // stock function
  function felectToStock() {
    try {
      instance
        .get("/pets/getPets", {
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
      console.log("error " + error);
    }
  }

  function deleteTostock() {
    const id = {
      petId: petId,
    };

    try {
      instance
        .delete("/pets/deletePet", id, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("delete pets stock ");
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }

  function updateToStock() {
    const updateStock = {
      petId,
      name,
      description,
      type,
      price,
      stock,
    };

    try {
      instance
        .put("/pets/updatePet", updateStock, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((respose) => {
          console.log("udpate to stock ");
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }

  function addToStcok() {
    const newStock = {
      name,
      description,
      type,
      price,
      stock,
    };

    try {
      instance
        .post("/pets/createPet", newStock, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((respose) => {
          console.log("add to stcok  ");
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }

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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-blue-50">
      <Navbar page="stock" />
      <button
        style={{
          width: 200,
          height: 50,
          borderRadius: 30,
          background: "blue ",
          color: "white ",
        }}
        onClick={felectToStockType}
      >
        Test to PetTypes{" "}
      </button>
      <br /> <br />
      <button
        style={{
          width: 200,
          height: 50,
          borderRadius: 30,
          background: "yellow ",
          color: "black ",
        }}
        onClick={felectToStock}
      >
        Test to stock{" "}
      </button>
    </div>
  );
}
