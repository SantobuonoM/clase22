import dotenv from "dotenv";
dotenv.config();

export default {
  mongodb: {
    cnxStr:
      "mongodb+srv://yopopoy19:42501719@cluster0.b03da.mongodb.net/DB?retryWrites=true&w=majority",
    options: {
      useNewUrlParser: true,
      user: "yopopoy19",
      pass: "42501719",
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    },
  },
  firebase: {
    type: "service_account",
    project_id: "backend-22d07",
    private_key_id: "efe9b8302fe6d2509736178a70bf9eaea5274353",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCpgYyQsYDvNkUf\ncZr6ZG5ocJe4N3CtcxoWuFwQqu6REzDP2CbEwoeF8j3Z/b5AuqPbyJYC/42MltEk\nc8sEg+nJApCCILCY1JK0yweRgRvj2aXK0qAiABhwRkCdssQna0x/Spp8IU+tmrA5\n4BLP1VuftYUqDYTmaOuaUXK9xGRzIi7Qlkq4wclN1w01pPpLTWKSfKFx94rIeDEM\nexYlARsTO1IZCWlalnpWuLKA2Jc24feGdlnPejdqmkRAqFGj1ymuBILi+tOmGzg9\nXD6o8WfPpOE+C/mYNbskIxiIXaCgorqJhdWGvkPBQ8ypJKQ3IzW6Qf7o5nMXGnQo\n9u5I8aKzAgMBAAECggEAO6DpoGr49u2p8k5GHQhgeJgHH1RNbI7dohl3tZtT8jAE\nj1E0Dip6f0nArWNgXqfphaLx9psMoeTaLM8ZH30CLGadDFHQnerFsxjrECoRdB13\n/7oJf/x1nGVyTKd67n0F+490ee9D9sfAb5OeOoONSEkUT79SvbUyEGbPjOc+COvt\noJXKKxuT8QMHydiXIFKSwUJUQbFKbXkEbDIJCVkYJP97M0zLwfJxCqyvTqNyShch\nDSRAP6wAjepO9spoToDuUjnyChzUNjlqFPphaqiHN276y0rBM0VG2EyaD7118+Su\n72f36T6Q1giUT0uHTsaapa+ELbaKFlMMs+40B5iD+QKBgQDnAo7gIV8OKDqsX5IM\nhlqnGCcwXg+bbAAT0h9Q9a9mrjV+SUXbMIzj2FP0DE1dOD4gL/9UwbwHR37r+acC\nWrFszQGu7jYMQGhq0qenFOj4Z6wJRfGGo7/D6XeF/LG7wRejUPpuQNumy45hL8yL\naZbfZNq8jDdEciBxCLn6bA/GeQKBgQC7172N8rEvygeoTFWNx9xcum5ubd7+rpW1\nM8HuYHswk5j89dhz4MgGERC8ZbvTFM4DVyOP95T0tt7zauJLePKxsJarvIFq7VV6\n3rXrkzCM2s2bcXABoxcNTac+TlC893RcyvKrERz1ds/LOetPA/LByPTjZaSV5cuf\n2vR4iuwXiwKBgBP9Va2xVY9dDc6yqmmpCpkg7usxiHoze0I70Xfo+peRBZH69y+D\nYP2qT4FzuxIQ9tdEL/z+kq2ykxoKTVhXzriSeM3RUR34SNDNj7JWjd5I4ksfIUo8\nSzDBuBUBC8Qqbkg0jqcRt7AUNyrTvwhlR6fnC0J7g6DJm2MMlUNFLIxJAoGBAIw/\n1IO7hJgN3BHIjMhDRUDm4bUJy8mUSKr2bgGxf8kRKtUUKfy7BB2jeD9yJf7ANeFA\nmojPbiQYtfZBA50ePPZ2xsiLAoX3li8bQfEWANXqOEGrPNm8D2YbaJeYmae9iuAN\nl4oqSNjtUNCH+i0Q4ZvWkyGFrpFM9e/w5z9pWkVpAoGAGD2gyXFDYzOsBBCou1sN\nkwa+kh8SfxFZ8bCv8M+ApNk09/E3GaAbTwyRzdyKmjWysLVaiNk7Riej5NY8hbnC\nWXAVKL1E0kJ3HVLEaEe/GvBHqKgoauclbwi0GMy8wajWoGHhLOLBuiwly9WLAKIS\naMdgi1vZSmcJjNRyzD40+N4=\n-----END PRIVATE KEY-----\n",
    client_email:
      "firebase-adminsdk-ippha@backend-22d07.iam.gserviceaccount.com",
    client_id: "106863627866725496111",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ippha%40backend-22d07.iam.gserviceaccount.com",
  },
  isAdmin: true,
  MODO_PERSISTENCIA: process.env.MODO_PERSISTENCIA,
};
