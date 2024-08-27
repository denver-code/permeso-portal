export default function Page() {
    return (
      <div className="p-6 rounded-md shadow max-w-lg mx-auto">
        <h1 className="text-3xl font-bold mb-4">
          Alpha Version Notice
        </h1>
        <p className="mb-2">
          <strong>Last updated:</strong> August 27, 2024
        </p>
        <p className="mb-4">
          Please read these before using Our Service in current state.
        </p>

         <section>
          <h2 className="text-2xl font-semibold mt-4 mb-2">
            Content
          </h2>
          <p>
           The Permeso Service allows you to get access to Planning applications fro multiple service at the same time. However as of 27th August 2024, the service is in Alpha version and may not be fully functional.
           This means that the service may not work as expected and may have bugs, errors or other issues that affect the user experience, if you encounter any issues please report them to us.
           Unfortunally we can&apos;t guarantee that the service will work as expected and we can&apos;t be held responsible for any issues that may arise from using the service, as some functionality highly depends on the other services, e.g  the council websites, which we have no control over.  <br/>
           Some features might be changed/removed/migrated to other services during the development process.
          </p>
        </section>


        <section>
          <h2 className="text-2xl font-semibold mt-4 mb-2">
            Author
          </h2>
          <p>
           The Permeso Service is developed by a single  <a
                href="https://savenko.tech"
                className="text-blue-600 hover:underline"
              >
                developer
              </a> and is not affiliated with any other company or organization. The service is developed as a side project and intended to be a small commercial product. 
           Therefore due to the nature of the product, the service may not be maintained or updated regularly, as well as the support may be limited in rare cases.  
          </p>
        </section>


        <section>
          <h2 className="text-2xl font-semibold mt-4 mb-2">
            Taking over the project
          </h2>
          <p>
           The Permeso Service is closed-source and the source code is not available to the public. <br/><br/> However, if you are interested in accessing the code base, please contact us at {' '}
              <a
                href="mailto:ihor@savenko.tech"
                className="text-blue-600 hover:underline"
              >
                ihor@savenko.tech
              </a> to get more details.

              <br/><br/>
                We are open to discuss the possibility of transferring the project to another developer or organization, who is willing to maintain and further develop the service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-4 mb-2">
            Contact Us
          </h2>
          <p>
            If you have any questions about this Notice, You can contact us:
          </p>
          <ul className="list-inside">
            <li>
              By email:{' '}
              <a
                href="mailto:ihor@savenko.tech"
                className="text-blue-600 hover:underline"
              >
                ihor@savenko.tech
              </a>
            </li>
          </ul>
        </section>


  
      </div>
    )
  }