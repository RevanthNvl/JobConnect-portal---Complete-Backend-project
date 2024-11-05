const testPostController = (req, resp) => {
    const {name} = req.body
    resp.status(200).send(`Your name is ${name} and id is ${req.params.id}`)
}

export {testPostController}