import { faker } from '@faker-js/faker';

const baseUrl = 'https://f4hatlr72b.execute-api.us-east-1.amazonaws.com/production'
const randomAuthor = faker.name.fullName();
const randomTitle = faker.animal.cat();
let postResponseBookId, postResponseAuthor, postResponseTitle, idForUpdate, putResponseAuthor,putResponseBookId,putResponseTitle ;
let messageSuccessDelete ,idForDelete
describe('Books', () => {
    beforeEach(() => {
      cy.request('POST', baseUrl + '/books', {
        title: randomTitle,
        author: randomAuthor
    })
        .then((response) =>{
          postResponseBookId = response.body.id;
          postResponseAuthor = response.body.author;
          postResponseTitle = response.body.title
          expect(response.status).to.eq(201)
        })  
    })

    it("should create book", () =>{
    cy.log(postResponseBookId, postResponseAuthor, postResponseTitle)  
      expect(postResponseTitle).to.equal(randomTitle)  
      expect(postResponseAuthor).to.equal(randomAuthor)
      expect(postResponseBookId.length).to.equal(32)
    })
     
    it("should get book", () =>{
     cy.request('GET',baseUrl + '/' + postResponseBookId) 
       .then((response) => {
        expect(response.status).to.eq(200)
        expect(postResponseTitle).to.equal(randomTitle)  
        expect(postResponseAuthor).to.equal(randomAuthor)
        expect(postResponseBookId.length).to.equal(32)
       })
    })

    it("should get all books", () =>{
     cy.request('GET',baseUrl+ '/books').as('books') 
     cy.get('@books').then((response) => {
      expect(response.status).to.eq(200)
      for (var i=0; i < response.body.body.length; i++) {
        expect(response.body.body[i]).to.have.keys(['id','title','author']);    
    }
       })
    })

    it("should update book", () =>{
     cy.log(postResponseBookId, postResponseAuthor, postResponseTitle) 
     cy.request('PUT',baseUrl + '/' + '/books'+postResponseBookId, {
         id:postResponseBookId,  
         title: randomTitle + 'UPDATE',
         author: randomAuthor + 'UPDATE',
    })
     .then((response) =>{
      putResponseBookId = response.body.id;
      putResponseAuthor = response.body.author;
      putResponseTitle = response.body.title
      expect(response.status).to.eq(200)
    }) 
    cy.log(putResponseBookId, putResponseAuthor, putResponseTitle)  
    idForUpdate =  postResponseBookId
    cy.request('GET',baseUrl + '/' + idForUpdate) 
      .then((response) => {
       expect(response.status).to.eq(200)
       expect(putResponseTitle).to.equal(randomTitle + 'UPDATE')  
       expect(putResponseAuthor).to.equal(randomAuthor + 'UPDATE')
       expect(idForUpdate.length).to.equal(32)
      })
  })

  it("should delete book", () =>{
    cy.request('DELETE',baseUrl + '/' + postResponseBookId).as('delete')
      .then((response) => {
        idForDelete = postResponseBookId
        cy.log(postResponseBookId)
        messageSuccessDelete = response.body.message
        expect(response.status).to.eq(200)
        expect(messageSuccessDelete).to.equal('Book was removed successfully') 
             
        cy.request({
          url: `${baseUrl + '/' + idForDelete}`,
          failOnStatusCode: false,
        }).then((response) => {
          expect(response).to.have.property('status', 404)
          expect(response).to.have.property('body').to.be.deep.equal({"message": "Not found"})
        })
     }) 
   })
  }) 