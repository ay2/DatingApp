using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public MessageRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public void AddMessage(Message message)
        {
            _context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            _context.Messages.Remove(message);
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FindAsync(id);
        }

        public async Task<PagedList<MessageDto>> GetMessagesForUser(MessageParams messageParams)
        {
            var query = _context.Messages
                .OrderByDescending(x => x.MessageSent)
                .AsQueryable();
            
            query =  messageParams.Container switch
            {
                "Inbox" => query.Where(u => u.RecipientUsername == messageParams.Username 
                    && !u.RecepientDeleted),
                "Outbox" => query.Where(u => u.SenderUsername == messageParams.Username 
                    && !u.SenderDeleted),
                _ => query.Where(u => u.RecipientUsername == messageParams.Username 
                    && !u.RecepientDeleted && u.MessageRead == null)
            };

            var messages = query.ProjectTo<MessageDto>(_mapper.ConfigurationProvider);

            return await PagedList<MessageDto>
                .CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<MessageDto>> GetMessageThread(string currentUserName, string recipientUserName)
        {
            var messages = await _context.Messages
                .Include(m => m.Sender).ThenInclude(s => s.Photos)
                .Include(m => m.Recipient).ThenInclude(r => r.Photos)
                .Where(
                    m => m.RecipientUsername == currentUserName && !m.RecepientDeleted &&
                        m.SenderUsername == recipientUserName ||
                        m.RecipientUsername == recipientUserName && !m.SenderDeleted &&
                        m.SenderUsername == currentUserName
                )
                .OrderBy(m => m.MessageSent)
                .ToListAsync();

            var unreadMessages = messages.Where(m => m.MessageRead == null &&
                m.RecipientUsername == currentUserName).ToList();
            
            if (unreadMessages.Any())
            {
                foreach (var message in unreadMessages)
                {
                    message.MessageRead = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();
            }

            return _mapper.Map<IEnumerable<MessageDto>>(messages);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}