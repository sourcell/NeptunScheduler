using System;
using System.Text.Json.Serialization;

namespace NeptunScheduler.API.Models
{
    public class User
    {
        public string Id { get; set; }

        public string Username { get; set; }

        [JsonIgnore]
        public string PasswordHash { get; set; }
        
        public string Roles { get; set; }

        public User()
        {
            this.Id = Guid.NewGuid().ToString();
        }
    }
}