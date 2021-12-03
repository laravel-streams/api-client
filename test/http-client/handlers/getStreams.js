client.test("Headers option exists", function() {
    client.assert(response.body.hasOwnProperty("headers"), "Cannot find 'headers' option in response");
});
