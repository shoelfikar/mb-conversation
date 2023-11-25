module.exports = {
    response: (res, result, status_code,message, err)=>{
      let resultPrint = {}
      resultPrint.code = status_code;
      resultPrint.data = result;
      resultPrint.message = message;
      resultPrint.err = err||null;
      return res.status(resultPrint.code).json(resultPrint);
    }
  }