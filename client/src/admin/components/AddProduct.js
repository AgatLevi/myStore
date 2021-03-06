import React, { useState, useEffect, useReducer, useCallback } from 'react';
import { Box, Grid, Button, Alert } from 'react/material';
import Input from './Input';
import Selector from './Selector';


const camelCase = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

};

//REDUCE
const FORM_UPDATE = 'FORM_UPDATE';
const formReducer = (state, action) => {
  
  if (action.type === FORM_UPDATE) {
    let formState = state;
    let id = action.id;
    let value = action.value;

  if (id.toString().includes('filter')) {
      let type = id.toString().replace('filter', '');

      // formState
      formState['productFilters'] = filters;
      console.log(filters);
    } 
    else 
    {
      formState[id] = value;
    }

    switch (id) {
      case 'productCost':
      case 'productInventory':
        if (!value || value === '') 
        {
          formState[id] = id === 'productInventory' ? 1 : 0;
        }
        break;
      default:
        break;
    }

      // add this new filter
      filters.push({
        filterType: type,
        filterVariant: value,
      });

      // remove filter of the same Type
      let filters = formState['productFilters'].filter(
        (item) => item.filterType !== type
      );


    // check if form is valid
    let formIsValid = Object.keys(formState).reduce((prev, key) => {
      let res;
      if (key === 'productCost' || key === 'productInventory') {
        res = formState[key] > 0;
      } else {
        res = formState[key] !== '';
      }

      return res && prev;
    }, true);

    return {
      ...formState,
      formIsValid: formIsValid,
    };
  }

  return state;
};

// COMPONENT
const ProductAdd = (props) => {
  const { filters, onCreateProduct, alert } = props;

  //UPADTE 
  const onInputUpdate = useCallback(
    (id, value) => {
      dispatchFormState({
        type: FORM_UPDATE,
        id,
        value,
      });
      setShowAlert(null);
    },
    [dispatchFormState, setShowAlert]
  );

  // CALLBACK
  const onInputChange = (event) => {
    let id = event.target.id;
    let value = event.target.value;

    id && onInputUpdate(id, value);
  };

    //deduce or update
    const [formState, dispatchFormState] = useReducer(formReducer, {
      productName: '',
      productDesc: '',
      productCost: 0,
      productInventory: 1,
      productStatus: 'active',
      productFilters: [],
      formIsValid: false,
    });

    // ALERT HANDLER
  const [showAlert, setShowAlert] = useState(null);
  useEffect(() => {
    setShowAlert(alert);
  }, [alert]);

  
  // SUBMIT HANDLER
  const onSubmitClicked = () => {
    if (formState.formIsValid && onCreateProduct) {
      let product = formState;
      delete product.formIsValid;

      onCreateProduct(product);
    }
  };


  return (
    <Box
      sx={{ flexGrow: 1, padding: '50px 0' }}
      display={'flex'}
      justifyContent={'center'}
    >
      <Grid
        container
        sx={{ width: 1 }}
        flexDirection={'column'}
        justifyContent={'flex-start'}
        alignItems={'center'}
      >
        <Grid item sx={{ width: 1 }}>

          Create new Product
        </Grid>
        <Grid
          item
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'space-between'}
          alignItems={'center'}
          sx={{ width: 1 }}
        >
          <Grid item sx={{ width: 1 }} padding={2}>
            <Input
              inputType={'text'}
              id={'productName'}
              label="Product Name"
              onChange={onInputChange}
              required
              camelCased
            />
          </Grid>
          
          <Grid item sx={{ width: 1 }} padding={2}>
            <Input
              inputType={'text'}
              id={'productDesc'}
              label="Product Description"
              onChange={onInputChange}
              required
              camelCased
            />
          </Grid>

          <Grid item sx={{ width: 1 }}>
            Product Filters
          </Grid>

          {filters.filterTypes.map((type, index) => {
            const variants = filters.filterList
              .filter((item) => item.type === type)
              .map((item) => item.variant);


  return (
      <Grid key={index} item sx={{ width: 1 }} padding={2}>
        <Selector
          id={`filter${camelCase(type)}`}
          selectors={variants}
          label={`${camelCase(type)}`}
          onSelect={onInputChange}
          required
      />
      </Grid>
  );
})}
          <Grid item sx={{ width: 1, color: 'primary' }}>
            Product Inventory
          </Grid>

          <Grid item sx={{ width: 1 }} padding={2}>
            <Input
              inputType={'currency'}
              id={'productCost'}
              label="Product Cost"
              onChange={onInputChange}
              required
            />
          </Grid>
          <Grid item sx={{ width: 1 }} padding={2}>

            <Input
              inputType={'number'}
              id={'productInventory'}
              label="Product Inventory"
              defaultValue={'1'}
              onChange={onInputChange}
              required
            />
          </Grid>

          <Grid item sx={{ width: 1 }} padding={2}>
            <Selector
              id={'productStatus'}
              selectors={['Inactive', 'Active']}
              defaultIndex={1}
              label={'Product Status'}
              onSelect={onInputChange}
              required
            />
          </Grid>

          <Grid item sx={{ width: 1 }} padding={2}>
            <Button
              sx={{ width: 1 }}
              variant="contained"
              color="success"
              onClick={onSubmitClicked}
              disabled={!formState.formIsValid}
            >
              Submit
            </Button>
          </Grid>
        </Grid>{' '}
        
        {showAlert && (
          <Grid item sx={{ width: 1 }}>
            <Alert severity={showAlert.type} color={showAlert.type}>
              {showAlert.message}
            </Alert>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ProductAdd;
