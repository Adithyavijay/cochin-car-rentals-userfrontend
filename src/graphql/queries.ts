import { gql } from "@apollo/client";

export const HELLO_QUERY = gql`
query { 
    hello
}

`;

export const GET_USER_DETAILS = gql`
    query GetUserDetails{
        getUserDetails{ 
        id
        name
        email
        phone
        city
        state
        country
        pincode
        profilePicture
        }       
    }
`; 



export const CHECK_AUTH = gql`
  query CheckAuth {
    checkAuth {
      isAuthenticated
      user {
        id
        name
        email
        profilePicture
      }
    }
  }
`;

export const GET_VEHICLE_DETAILS = gql`
  query GetVehicle($id: ID!) {
    getVehicleDetails(id: $id) {
      id
      name
      manufacturer {
        id
        name
      }
      model {
        id
        name
      }
      dailyRate
      category
      transmission
      seatingCapacity
      yearOfManufacture
      maintenanceStatus
      primaryImage
      otherImages
      fuelType
      description
    }
  }
`;

export const GET_AVAILABLE_VEHICLES = gql`
  query GetAvailableVehicles {
    getAvailableVehiclesForRent {
      id
      name
      manufacturer {
        id
        name
      }
      model {
        id
        name
      }
      dailyRate
      category
      transmission
      seatingCapacity
      yearOfManufacture
      primaryImage
      otherImages
      availableQuantity
    }
  }
`;

export const SEARCH_VEHICLES = gql`
query SearchVehiclesUser($input: SearchVehicleInput!) {
  searchVehiclesUser(input: $input) {  # Fixed typo in operation name
    results {
      id
      name
      manufacturer {
        id
        name
      }
      model {
        id
        name
      }
      dailyRate
      category
      transmission
      seatingCapacity
      yearOfManufacture
      primaryImage
    }
    totalCount
    facets {               # Added facets
      manufacturers {
        value
        count
      }
      categories {
        value
        count
      }
      transmission {
        value
        count
      }
      fuelTypes {
        value
        count
      }
      seatingCapacity {
        value
        count
      }
    }
  }
}
`;

