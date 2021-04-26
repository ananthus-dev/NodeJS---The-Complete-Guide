const sum = (a, b) => {
  if (a && b) {
    return a + b;
  }
  throw new Error('Invalid arguments');
};

try {
  console.log(sum(1));
} catch (error) {
  //error is the Error object thrown by the sum()function
  console.log('Error occurred!');
//   console.log(error);
}

// console.log(sum(1));
//if we don;t use the try catch block , then if error occurs ; the code stops execution and remaining code will not executed
//if try catch is used , then the error will be handled and the remaining code will be executed

console.log('This works!');
