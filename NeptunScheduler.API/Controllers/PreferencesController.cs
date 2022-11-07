using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NeptunScheduler.Models;
using NeptunScheduler.Repository;

namespace NeptunScheduler.API.Controllers
{

    [ApiController]
    [Route("[controller]")]
    [Authorize(Roles = "user")]
    public class PreferencesController : ControllerBase
    {
        private IUserRepository _userRepo;

        private IDailyActiveTimeRepository _dailyActiveTimeRepo;

        private IBusyTimeblockRepository _busyTimeblockRepo;

        public PreferencesController(IUserRepository userRepo, IDailyActiveTimeRepository dailyActiveTimeRepo, IBusyTimeblockRepository busyTimeblockRepository)
        {
            _userRepo = userRepo;
            _dailyActiveTimeRepo = dailyActiveTimeRepo;
            _busyTimeblockRepo = busyTimeblockRepository;
        }

        [HttpPost("busytimeblocks")]
        public ActionResult<BusyTimeblock> CreateBusyTimeblock(BusyTimeblock dto)
        {
            User user = GetUser();
            return _busyTimeblockRepo.Add(user.Id, dto);
        }

        [HttpGet("busytimeblocks")]
        public ActionResult<List<BusyTimeblock>> GetBusyTimeblocks()
        {
            User user = GetUser();
            return _busyTimeblockRepo.GetAll(user.Id).ToList();
        }

        [HttpPut("busytimeblocks/{id}")]
        public ActionResult<BusyTimeblock> UpdateBusyTimeblock(string id, BusyTimeblock dto)
        {
            User user = GetUser();
            BusyTimeblock res = _busyTimeblockRepo.Update(user.Id, id, dto);
            if (res == null)
                return BadRequest("The User has no BusyTimeblock with this id.");
            return res;
        }

        [HttpDelete("busytimeblocks/{id}")]
        public ActionResult<BusyTimeblock> DeleteBusyTimeblock(string id)
        {
            User user = GetUser();
            BusyTimeblock res = _busyTimeblockRepo.Delete(user.Id, id);
            if (res == null)
                return BadRequest("The User has no BusyTimeblock with this id.");
            return res;
        }

        [HttpGet("dailyactivetimes")]
        public ActionResult<List<DailyActiveTime>> GetDailyActiveTimes()
        {
            User user = GetUser();
            return _dailyActiveTimeRepo.GetAll(user.Id).ToList();
        }

        [HttpPut("dailyactivetimes/{id}")]
        public ActionResult<DailyActiveTime> UpdateDailyActiveTime(string id, DailyActiveTime dto)
        {
            User user = GetUser();
            DailyActiveTime res = _dailyActiveTimeRepo.Update(user.Id, id, dto);
            if (res == null)
                return BadRequest("The User has no Daily Active Time with this id.");
            return res;
        }

        private User GetUser()
        {
            var identity = this.User.Identity as ClaimsIdentity;
            string userId = identity?.FindFirst("userid")?.Value;
            return _userRepo.GetUserById(userId);
        }
    }
}
